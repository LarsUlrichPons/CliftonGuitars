import { Ionicons, MaterialIcons, FontAwesome5, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router'; 
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StatusBar,
    Image,
    Modal,
    ScrollView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ⭐️ START: Interface Definition moved to the global scope
interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    selected: boolean;
}

interface OrderDetails {
    orderNumber: string;
    totalAmount: string; // Formatted total
    paymentMethod: string;
    estimatedDelivery: string;
}
// ⭐️ END: Interface Definition

// ⭐️ START: OrderSuccessModal Component (Defined globally)
const OrderSuccessModal = ({ visible, onClose, details }: { visible: boolean, onClose: () => void, details: OrderDetails }) => {
    
    // Automatically close and navigate after 4 seconds
    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                onClose(); 
            }, 4000); 
            return () => clearTimeout(timer);
        }
    }, [visible, onClose]);

    if (!visible) return null;
    
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
        >
            {/* Backdrop: Semi-transparent gray covering the whole screen */}
            <View className="flex-1 items-center justify-center bg-gray-600/60 p-6">
                
                {/* The Order Placed Success Card */}
                <View className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
                    
                    {/* Title and Header Text */}
                    <Text className="text-xl font-extrabold text-gray-800 text-center mb-6">
                        Order Placed Successfully
                    </Text>

                    <Text className="text-sm text-gray-700 mb-2">
                        Your order has been received and is now being processed.
                    </Text>
                    <Text className="text-sm text-gray-700 mb-6">
                        You will receive a confirmation email shortly with your order details.
                    </Text>

                    {/* Order Details Summary Block */}
                    <View className="bg-gray-100 p-4 rounded-lg mb-4">
                        
                        {/* Order Number */}
                        <View className="flex-row justify-between py-0.5">
                            <Text className="text-sm text-gray-600">Order Number:</Text>
                            <Text className="text-sm font-bold text-gray-800">{details.orderNumber}</Text>
                        </View>
                        
                        {/* Total Amount */}
                        <View className="flex-row justify-between py-0.5">
                            <Text className="text-sm text-gray-600">Total Amount:</Text>
                            <Text className="text-sm font-bold text-gray-800">₱{details.totalAmount}</Text>
                        </View>
                        
                        {/* Payment Method */}
                        <View className="flex-row justify-between py-0.5">
                            <Text className="text-sm text-gray-600">Payment Method:</Text>
                            <Text className="text-sm font-bold text-gray-800">{details.paymentMethod}</Text>
                        </View>

                        {/* Estimated Delivery */}
                        <View className="flex-row justify-between py-0.5 mt-1">
                            <Text className="text-sm text-gray-600">Estimated Delivery:</Text>
                            <Text className="text-sm font-bold text-gray-800">{details.estimatedDelivery}</Text>
                        </View>
                    </View>
                    
                    <Text className="text-xs text-center text-gray-500 mt-2">
                        Redirecting to home screen shortly...
                    </Text>

                </View>
            </View>
        </Modal>
    );
};
// --- END: OrderSuccessModal Component ---


// --- START: Helper Component (RadioButton) ---
interface RadioButtonProps {
    name: string;
    icon?: React.ReactNode;
    isSelected: boolean;
    onPress: () => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({
    name,
    icon,
    isSelected,
    onPress,
}) => (
    <TouchableOpacity
        onPress={onPress}
        className="flex-row items-center py-3 px-2 rounded-lg border border-gray-200 mb-2"
    >
        {icon && <View className="mr-3">{icon}</View>}
        <Text className="flex-1 text-base text-black">{name}</Text>
        <MaterialIcons
            name={isSelected ? 'radio-button-checked' : 'radio-button-unchecked'}
            size={22}
            color={isSelected ? '#FFC700' : '#CCCCCC'}
        />
    </TouchableOpacity>
);
// --- END: Helper Component ---


const Checkout = () => {
    const [selectedPayment, setSelectedPayment] = useState('');
    const router = useRouter();
    const isMounted = useRef(true);
    // ⭐️ New state for COD success modal
    const [showOrderSuccess, setShowOrderSuccess] = useState(false); 

    // GET DATA FROM ROUTE PARAMS
    const params = useLocalSearchParams();
    
    // Safely parse the complex object (selectedItems) and number data from the router params
    const checkoutItems: CartItem[] = params.selectedItems ? JSON.parse(params.selectedItems as string) : [];
    const subtotal = Number(params.subtotal || 0);
    const shippingFee = Number(params.shippingFee || 0);
    const total = Number(params.total || 0);

    // ⭐️ Order details state for the COD success modal
    const orderDetails: OrderDetails = {
        orderNumber: '#2002', // Mock order number
        totalAmount: total.toFixed(2), 
        paymentMethod: 'Cash on Delivery', // Initial value, overridden for Gcash route
        estimatedDelivery: 'Oct 26–28, 2025', 
    };

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    const safeSetPayment = (payment: string) => {
        if (isMounted.current) setSelectedPayment(payment);
    };

    // Function that runs when the modal timer finishes
    const handleModalCloseAndNavigate = () => {
        setShowOrderSuccess(false);
        router.replace('/home'); // Go back to a non-payment screen
    };

    const handleFinalCheckout = () => {
        if (total === 0) {
            alert('Cart is empty.');
            return;
        }

        if (selectedPayment === 'Gcash') {
            // 1. ROUTE PUSH FOR GCASH PAYMENT
            router.push({
                pathname: "/PaymentGcash", 
                params: { 
                    total: total.toString(),
                }  
            });
        } else if (selectedPayment === 'Cash on Delivery') {
            // 2. SHOW MODAL FOR COD PAYMENT
            setShowOrderSuccess(true);
        } else {
            alert('Please select a payment method.');
        }
    };
    
    // ⭐️ Handler for 'Change' Address button
    const handleAddressChange = () => {
        router.push('/Address');
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <View className="flex-1 bg-gray-100">
                {/* Header */}
                <View className="bg-white border-b border-gray-200 shadow-sm pt-6 pb-5 px-4 flex-row items-center">
                    <TouchableOpacity className="pr-3" onPress={() => router.back()}>
                        <MaterialCommunityIcons name="chevron-left" size={30} color="#1a1a1a" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-black">Check Out</Text>
                </View>

                {/* Scrollable Items Section */}
                <ScrollView 
                    contentContainerStyle={{ 
                        paddingBottom: 20,
                        flexGrow: 1 
                    }}
                    showsVerticalScrollIndicator={true}
                    className="flex-1"
                >
                    {/* Delivery Address */}
                    <View className="flex-row p-4 bg-white mb-1 items-start">
                        <View className="p-2 mr-4 bg-[#FFC700] rounded-lg self-stretch">
                            <MaterialIcons name="location-on" size={30} color="#FFFFFF" />
                        </View>

                        <View className="flex-1 pr-3">
                            <Text className="text-sm text-gray-600 mb-1">Delivery Address</Text>
                            <Text className="text-sm font-bold text-black">
                                Aldous Gusion (+63) 945 527 0831
                            </Text>
                            <Text className="text-sm text-gray-700">
                                299 Varona st, Barangay 97, Tondo I / II, Metro Manila
                            </Text>
                        </View>
                        {/* ⭐️ ADDRESS CHANGE BUTTON MODIFIED ⭐️ */}
                        <TouchableOpacity onPress={handleAddressChange}>
                            <Text className="text-blue-500 font-semibold pt-1">Change</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Product Items (Dynamically mapped) */}
                    <View className="mt-1">
                        {checkoutItems.map(item => (
                            <View key={item.id} className="flex-row items-center p-4 bg-white border-b border-gray-100 last:border-b-0">
                                <Image
                                    source={{ uri: item.image }}
                                    className="w-20 h-20 rounded mr-4"
                                />
                                <View className="flex-1">
                                    <Text className="text-base font-semibold text-black">
                                        {item.name}
                                    </Text>
                                </View>
                                <View className="items-end ml-4">
                                    <Text className="text-base font-bold text-red-600">
                                        ₱{(item.price * item.quantity).toLocaleString('en-PH')}
                                    </Text>
                                    <Text className="text-sm text-gray-500 mt-1">x{item.quantity}</Text>
                                </View>
                            </View>
                        ))}
                        <View className="h-1 bg-gray-100" /> 
                    </View>
                </ScrollView>

                {/* Fixed Bottom Section - Payment Method & Payment Details */}
                <View className="bg-white border-t border-gray-200">
                    {/* Payment Methods */}
                    <View className="p-2 pt-3 bg-white border-b border-gray-100">
                        <Text className="text-l text-gray-600 mb-3 font-bold">Payment Methods</Text>

                        <RadioButton
                            name="Cash on Delivery"
                            isSelected={selectedPayment === 'Cash on Delivery'}
                            onPress={() => safeSetPayment('Cash on Delivery')}
                            icon={<FontAwesome5 name="money-bill-wave" size={20} color="#4CAF50" />}
                        />

                        <RadioButton
                            name="Gcash"
                            isSelected={selectedPayment === 'Gcash'}
                            onPress={() => safeSetPayment('Gcash')}
                            icon={<FontAwesome name="credit-card" size={20} color="#2196F3" />}
                        />
                    </View>

                    {/* Payment Details */}
                    <View className="bg-white pt-2 pb-4 pr-5 pl-5">
                        <Text className="text-sm text-gray-600 mb-1 font-bold">Payment Details</Text>
                        <View className="flex-row justify-between py-1">
                            <Text className="text-sm text-gray-700">Product Subtotal:</Text>
                            <Text className="text-sm text-black">₱{subtotal.toLocaleString('en-PH')}</Text>
                        </View>
                        <View className="flex-row justify-between py-1">
                            <Text className="text-sm text-gray-700">Shipping Subtotal:</Text>
                            <Text className="text-sm text-black">₱{shippingFee.toLocaleString('en-PH')}</Text>
                        </View>
                        <View className="flex-row justify-between pt-3 mt-3 border-t border-gray-200">
                            <Text className="text-lg font-bold text-black">Total Payment</Text>
                            <Text className="text-lg font-bold text-red-600">₱{total.toLocaleString('en-PH')}</Text>
                        </View>
                    </View>

                    {/* Check Out Button */}
                    <View className="bg-white border-t border-gray-200 p-4">
                        <TouchableOpacity 
                            onPress={handleFinalCheckout} 
                            className={`p-4 rounded-md items-center mx-1 ${total === 0 || selectedPayment === '' ? 'bg-gray-400' : 'bg-[#2E2F2A]'}`}
                            disabled={total === 0 || selectedPayment === ''}
                        >
                            <Text className="text-white text-lg font-bold">Check Out</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ⭐️ Render the Order Success Modal */}
                <OrderSuccessModal
                    visible={showOrderSuccess}
                    onClose={handleModalCloseAndNavigate}
                    details={orderDetails}
                />
            </View>
        </SafeAreaView>
    );
};

export default Checkout;