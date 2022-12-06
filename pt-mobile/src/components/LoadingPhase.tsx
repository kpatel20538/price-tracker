import React, { ReactNode } from "react";
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { OpenSans_400Regular } from "@expo-google-fonts/open-sans";
import { RobotoSlab_400Regular } from "@expo-google-fonts/roboto-slab";
import { SpaceMono_400Regular } from "@expo-google-fonts/space-mono";

type Props = {
  children: ReactNode;
}

export default function LoadingPhase({ children }: Props) {
  const [isFontsLoaded] = useFonts({
    OpenSans: OpenSans_400Regular,
    RobotoSlab: RobotoSlab_400Regular,
    SpaceMono: SpaceMono_400Regular,
  });

  return isFontsLoaded ? <>{children}</> : <AppLoading />
}