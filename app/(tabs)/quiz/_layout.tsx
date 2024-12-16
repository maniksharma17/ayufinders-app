import React from "react";
import { Stack } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";

export default function CategoryLayout() {

  const params = useSearchParams();
  const category = params.get("category");

  return (
    <Stack screenOptions={{
      
    }}>
      <Stack.Screen
        name="index"
        options={({ route }) => ({
          title: category || "Quiz",
          headerShown: false,
          
        })}
      />

    </Stack>
  );
}
