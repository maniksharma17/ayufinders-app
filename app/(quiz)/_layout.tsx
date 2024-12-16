import React from "react";
import { Stack } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";

export default function CategoryLayout() {

  const params = useSearchParams();
  const category = params.get("category");

  return (
    <Stack screenOptions={{
      animation: "none",
    }}>
      <Stack.Screen
        name="[category]/[quizId]/index"
        options={({ route }) => ({
          title: category || "Quiz",
          headerStyle: { backgroundColor: "#3f51b5" },
          headerTintColor: "#fff",
        })}
      />
    </Stack>
  );
}
