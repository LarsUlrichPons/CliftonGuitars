import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import {
    Image,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
    Modal,
    Alert,
    Animated,
    Image as RNImage,
    TouchableOpacity as RNTouchableOpacity,
} from "react-native";

// ⭐️ START: Type Definitions
type SetQuantity = React.Dispatch<React.SetStateAction<number>>;

interface ProductDetail {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    displayPrice: string;
    description: string;
}

interface QuantityModalProps {
    visible: boolean;
    product: ProductDetail;
    selectedQuantity: number;
    setSelectedQuantity: SetQuantity;
    onConfirm: () => void;
    onClose: () => void;
}

interface ToastProps {
    visible: boolean;
    message: string;
    productName: string;
}
// ⭐️ END: Type Definitions


// Utility function to safely extract a single string from router params
const resolveParamToString = (param: string | string[] | null | undefined, defaultValue: string): string => {
    if (Array.isArray(param)) {
        return param[0] || defaultValue;
    }
    return param?.toString() || defaultValue;
};

// Mock wishlist data storage (in a real app, this would be in a context or state management)
let WISHLIST_ITEMS: any[] = [];

const ProductDetailScreen = () => {
    const router = useRouter(); 
    const params = useLocalSearchParams();

    const [showModal, setShowModal] = useState(false);
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [showWishlistToast, setShowWishlistToast] = useState(false);
    const [showWishRemovedToast, setShowRemovedToast] = useState(false);

    const product: ProductDetail = { 
        id: resolveParamToString(params.id, "123"),
        name: resolveParamToString(params.name, "Clifton Hofner Style Violin Bass"),
        price: Number(resolveParamToString(params.price, "13800").replace(/[^0-9.]/g, '')),
        imageUrl:
            resolveParamToString(params.imageUrl, "") !== ""
            ? resolveParamToString(params.imageUrl, "")
            : "https://via.placeholder.com/600x400/CCCCCC/FFFFFF?text=Violin+Bass",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin tempus dignissim nisl, quis interdum dolor pretium in. Sed nibh nisl, pretium in eleifend id, blandit aliquet diam.",
        displayPrice: resolveParamToString(params.price, "13,800"),
    };

    // Check if product is already in wishlist on component mount
    useEffect(() => {
        const checkWishlistStatus = () => {
            const isWishlisted = WISHLIST_ITEMS.some(item => item.id === product.id);
            setIsInWishlist(isWishlisted);
        };
        
        checkWishlistStatus();
    }, [product.id]);

    const handleBack = () => router.back();

    const handleAddToCart = () => {
        setShowModal(true);
    };

    const finalizeAddToCart = () => {
        setShowModal(false);
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 3000);
        setSelectedQuantity(1); 
    };

    const handleBuyNow = () => {
        const itemForCheckout = [{
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1, 
            image: product.imageUrl,
            selected: true,
        }];
        
        const subtotal = itemForCheckout[0].price * itemForCheckout[0].quantity;
        const shippingFee = 300; 
        const total = subtotal + shippingFee;

        router.push({
            pathname: "/Checkout",
            params: {
                selectedItems: JSON.stringify(itemForCheckout),
                subtotal: subtotal.toString(),
                shippingFee: shippingFee.toString(),
                total: total.toString(),
            },
        });
    };
    
    const handleNavigateToCart = () => {
        router.push('/cart');
    };

    // ⭐️ NEW: Wishlist functionality
   const handleWishlistToggle = () => {
    if (isInWishlist) {
        // Remove from wishlist
        WISHLIST_ITEMS = WISHLIST_ITEMS.filter(item => item.id !== product.id);
        setIsInWishlist(false);

        // Show "removed" toast
        setShowRemovedToast(true);
        setTimeout(() => setShowRemovedToast(false), 3000);
    } else {
        // Add to wishlist
        const wishlistItem = {
            id: product.id,
            productName: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            inStock: true,
        };

        WISHLIST_ITEMS.push(wishlistItem);
        setIsInWishlist(true);

        // Show "added" toast
        setShowWishlistToast(true);
        setTimeout(() => setShowWishlistToast(false), 3000);
    }
};

    const handleNavigateToWishlist = () => {
        router.push('/Wishlist');
    };
    
    const HEADER_TOP_PADDING = Platform.OS === "android" ? (StatusBar.currentHeight || 40) + 10 : 50;

    return (
        <View className="flex-1 bg-white">
            <StatusBar
                barStyle="dark-content"
                backgroundColor={Platform.OS === "android" ? "#FFFFFF" : "transparent"}
            />

            {/* ===================== HEADER ===================== */}
            <View 
                style={{ paddingTop: HEADER_TOP_PADDING }} 
                className="flex-row items-center justify-between bg-white px-3 pb-2 border-b border-gray-200"
            >
                <TouchableOpacity onPress={handleBack} className="p-1">
                    <MaterialCommunityIcons name="chevron-left" size={30} color="#1a1a1a" />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-[#1a1a1a] uppercase">DETAILS</Text>
                
                {/* Cart Icon Target */}
                <TouchableOpacity className="p-1" onPress={handleNavigateToCart}>
                    <Ionicons name="cart-outline" size={24} color="#1a1a1a" />
                </TouchableOpacity>
            </View>

            {/* ===================== CONTENT ===================== */}
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="flex-1">
                {/* PRODUCT IMAGE */}
                <View className="w-full h-[300px] bg-white justify-center items-center">
                    <Image
                        source={{ uri: product.imageUrl }}
                        className="w-[95%] h-[95%]"
                        resizeMode="contain"
                    />
                </View>

                {/* PRODUCT INFO */}
                <View className="bg-white p-4 mx-4 rounded-lg shadow-md elevation-2">
                    <View className="relative flex-row items-start mb-3">
                        <View className="flex-1 pr-10">
                            <Text className="text-xl font-extrabold text-red-600 mb-1">
                                ₱ {product.displayPrice}
                            </Text>
                            <Text className="text-base font-bold text-[#1a1a1a]">
                                {product.name}
                            </Text>
                        </View>
                        {/* ⭐️ UPDATED: Heart icon with wishlist functionality */}
                        <TouchableOpacity 
                            className="absolute right-0 top-0 p-1"
                            onPress={handleWishlistToggle}
                        >
                            <Ionicons 
                                name={isInWishlist ? "heart" : "heart-outline"} 
                                size={35} 
                                color={isInWishlist ? "#EF4444" : "#1a1a1a"} 
                            />
                        </TouchableOpacity>
                    </View>
                    
                    <Text className="text-sm leading-5 text-gray-600 mt-2">
                        {product.description}
                    </Text>
                </View>
            </ScrollView>

            {/* ===================== MODAL COMPONENT ===================== */}
            <QuantityModal
                visible={showModal}
                product={product}
                selectedQuantity={selectedQuantity}
                setSelectedQuantity={setSelectedQuantity}
                onConfirm={finalizeAddToCart}
                onClose={() => {
                    setShowModal(false);
                    setSelectedQuantity(1); 
                }}
            />

            {/* ⭐️ CONFIRMATION TOAST ⭐️ */}
            <ConfirmationToast
                visible={showConfirmation}
                message={`Item has been added to your shopping cart`}
                productName={product.name}
            />

            {/* ⭐️ NEW: Wishlist Toast ⭐️ */}
            <WishlistToast
                visible={showWishlistToast}
                message={`Item has been added to your wishlist`}
                productName={product.name}
                onViewWishlist={handleNavigateToWishlist}
            />

            <RemovedWishlistToast
                visible={showWishRemovedToast}
                productName={product.name}
                />

            {/* ===================== BUTTONS ===================== */}
            <View className="flex-row justify-between absolute bottom-[50px] left-4 right-4">
                <TouchableOpacity
                    className="flex-1 flex-row items-center justify-center bg-gray-100 rounded-lg py-3 mr-2 border border-gray-300"
                    onPress={handleAddToCart}
                >
                    <Ionicons name="add" size={18} color="#000" />
                    <Text className="text-base font-bold text-black ml-1">Add to Cart</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    className="flex-1 flex-row items-center justify-center bg-[#FF9500] rounded-lg py-3 ml-2"
                    onPress={handleBuyNow} 
                >
                    <Ionicons name="bag-handle-outline" size={18} color="#fff" />
                    <Text className="text-base font-bold text-white ml-1">Buy Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// --- START: Confirmation Toast Component ---
const ConfirmationToast: React.FC<ToastProps> = ({ visible, message }) => {
    const opacity = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(opacity, {
            toValue: visible ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [visible, opacity]);

    if (!visible) return null;

    return (
        <Animated.View
            style={[{ opacity }]}
            className="absolute inset-0 items-center justify-center px-4 z-50" 
            pointerEvents="none" 
        >
            <View className="items-center justify-center bg-white rounded-lg p-5 shadow-2xl elevation-5 w-64 h-36">
                <View className="bg-[#12BCB4] rounded-full p-4 mb-2">
                    <Ionicons name="checkmark-sharp" size={30} color="white" />
                </View>
                <Text className="text-black text-center text-sm font-semibold mt-1">
                    {message}
                </Text>
            </View>
        </Animated.View>
    );
};
// --- END: Confirmation Toast Component ---

// ⭐️ NEW: Wishlist Toast Component ⭐️
const WishlistToast: React.FC<any> = ({ visible, message, productName, onViewWishlist }) => {
    const opacity = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(opacity, {
            toValue: visible ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [visible, opacity]);

    if (!visible) return null;

    return (
        <Animated.View
            style={[{ opacity }]}
            className="absolute inset-0 items-center justify-center px-4 z-50" 
            pointerEvents="box-none"
        >
            <View className="items-center justify-center bg-white rounded-lg p-5 shadow-2xl elevation-5 w-72">
                {/* Red heart icon for wishlist */}
                <View className="bg-red-500 rounded-full p-4 mb-2">
                    <Ionicons name="heart" size={30} color="white" />
                </View>
                
                <Text className="text-black text-center text-sm font-semibold mb-3">
                    {message}
                </Text>
                
                {/* View Wishlist Button */}
                <TouchableOpacity 
                    onPress={onViewWishlist}
                    className="bg-red-500 px-6 py-2 rounded-full"
                >
                    <Text className="text-white text-sm font-semibold">View Wishlist</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};


const RemovedWishlistToast: React.FC<any> = ({ visible, productName }) => {
    const opacity = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(opacity, {
            toValue: visible ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [visible, opacity]);

    if (!visible) return null;

    return (
        <Animated.View
            style={[{ opacity }]}
            className="absolute inset-0 items-center justify-center px-4 z-50"
            pointerEvents="none"
        >
            <View className="items-center justify-center bg-white rounded-lg p-5 shadow-2xl elevation-5 w-72">
                {/* Gray heart icon for removal */}
                <View className="bg-gray-400 rounded-full p-4 mb-2">
                    <Ionicons name="heart-dislike" size={30} color="white" />
                </View>

                <Text className="text-black text-center text-sm font-semibold mb-1">
                    Removed from wishlist
                </Text>
                <Text className="text-gray-500 text-center text-xs">
                    {productName}
                </Text>
            </View>
        </Animated.View>
    );
};


// --- START: QuantityModal Component ---
const QuantityModal: React.FC<QuantityModalProps> = ({
    visible,
    product,
    selectedQuantity,
    setSelectedQuantity,
    onConfirm,
    onClose,
}) => {
    const handleQuantityChange = (delta: number) => { 
        setSelectedQuantity(prev => Math.max(1, prev + delta));
    };
    
    const MODAL_BOTTOM_PADDING = Platform.select({ ios: 40, android: 20 });

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableOpacity 
                activeOpacity={1} 
                onPress={onClose}
                className="flex-1 justify-end bg-black/50"
            >
                <View 
                    style={{ paddingBottom: MODAL_BOTTOM_PADDING }} 
                    className="w-full bg-white rounded-t-xl shadow-2xl elevation-5"
                >
                    <View className="flex-row p-4 items-start border-b border-gray-200 w-full">
                        <Image 
                            source={{ uri: product.imageUrl }} 
                            className="w-20 h-20 rounded-lg mr-4" 
                        />
                        <View className="flex-1 justify-center">
                            <Text className="text-sm text-gray-600 mb-1" numberOfLines={1}>
                                {product.name}
                            </Text>
                            <Text className="text-xl font-bold text-red-600">
                                ₱{product.displayPrice}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={onClose} className="p-1 absolute top-3 right-3">
                            <Ionicons name="close" size={24} color="#1a1a1a" />
                        </TouchableOpacity>
                    </View>

                    <View className="w-full px-4 py-4">
                        <View className="flex-row justify-between items-center py-2">
                            <Text className="text-base font-semibold text-[#1a1a1a]">Quantity</Text>
                            <View className="flex-row items-center border border-gray-300 rounded-md">
                                <TouchableOpacity 
                                    className="px-4 py-2 bg-gray-100 rounded-l-md"
                                    onPress={() => handleQuantityChange(-1)}
                                    disabled={selectedQuantity <= 1}
                                >
                                    <Text className="text-lg font-medium text-black">−</Text> 
                                </TouchableOpacity>
                                
                                <Text className="text-base font-semibold text-black px-4">
                                    {selectedQuantity}
                                </Text>
                                
                                <TouchableOpacity 
                                    className="px-4 py-2 bg-gray-100 rounded-r-md"
                                    onPress={() => handleQuantityChange(1)}
                                >
                                    <Text className="text-lg font-medium text-black">+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    
                    <TouchableOpacity
                        className="w-[90%] self-center bg-[#2E2F2A] rounded-lg py-4 mt-4" 
                        onPress={onConfirm}
                    >
                        <Text className="text-white text-lg font-bold text-center">Add to cart</Text>
                    </TouchableOpacity>

                </View>
            </TouchableOpacity>
        </Modal>
    );
};
// --- END: QuantityModal Component ---


export default ProductDetailScreen;