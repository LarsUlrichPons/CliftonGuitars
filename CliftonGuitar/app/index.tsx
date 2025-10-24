// app/index.tsx
import { useEffect } from 'react';
import { Redirect, useRouter } from 'expo-router';

export default function IndexRedirect() {
 return <Redirect href="/login" />;
}