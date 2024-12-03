import React, { useState, useEffect, useRef } from "react";
import { Text, StyleSheet, TouchableOpacity, View, ScrollView, Modal } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { useRecoilValue } from "recoil";
import { userAtom } from "@/store/atoms/user";
import { Colors } from "@/constants/Colors";
import axios from "axios";
import { Linking } from "react-native";
import { useSearchParams } from "expo-router/build/hooks";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from "@react-navigation/native";

type Question = {
  text: string;
  options: { text: string }[];
  correctOption: number;
  explanation?: string;
  reference?: {
    title?: string;
    link?: string;
  };
};

export default function QuizScreen() {
  const colorScheme = useColorScheme();
  const user = useRecoilValue(userAtom);
  const router = useRouter();
  const {dark} = useTheme()

  const [selectedAnswers, setSelectedAnswers] = useState<(number|null)[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showScoreModal, setShowScoreModal] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

  const params = useSearchParams();
  const quizId = params.get("quizId");
  const category = params.get("category");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_BASE_URL}/quiz/${quizId}`
        );
        const questions = response.data.quiz;
        setQuestions(questions);
        setSelectedAnswers(Array(questions.length).fill(null));
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [quizId]);

  useEffect(() => {
    if (!user.isLoggedIn) router.replace("/");
  }, []);

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    if (!submitted) {
      const updatedAnswers = [...selectedAnswers];
      updatedAnswers[questionIndex] = optionIndex;
      setSelectedAnswers(updatedAnswers);
    }
  };

  const handleSubmit = () => {
    let calculatedScore = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === questions[index].correctOption) {
        calculatedScore += 1;
      }
    });
    setScore(calculatedScore);
    setSubmitted(true);
    setShowScoreModal(true);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleRetry = () => {
    setSelectedAnswers(Array(questions.length).fill(null));
    setScore(0);
    setCurrentQuestionIndex(0)
    setSubmitted(false);
    setShowScoreModal(false)
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const getRemark = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return "Bravo!\nPerfect score.";
    if (percentage >= 70) return "Good!\nKeep it up.";
    return "Try again!\nYou can do better.";
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (isLoading) {
    return (
      <ThemedView style={colorScheme === "dark" ? styles.darkContainer : styles.lightContainer}>
        <Text>Loading...</Text>
      </ThemedView>
    );
  }

  if (questions.length === 0) {
    return (
      <ThemedView style={colorScheme === "dark" ? styles.darkContainer : styles.lightContainer}>
        <Text>No questions found for this quiz.</Text>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={colorScheme === "dark" ? styles.darkContainer : styles.lightContainer}>
      <ThemedView style={styles.headerStyle}>
        <ThemedText style={styles.headerText}>{category}</ThemedText>
      </ThemedView>
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContainer}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <ThemedText style={styles.progressText}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </ThemedText>
          <ThemedView style={styles.progressBar}>
            <ThemedView
              style={[
                styles.progressFill,
                {
                  width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                },
              ]}
            />
          </ThemedView>
        </View>

        {/* Question */}
        <View style={styles.questionContainer}>
          <ThemedText style={styles.questionText}>
            {`${currentQuestionIndex + 1}. ${currentQuestion.text}`}
          </ThemedText>
          
          {/* Options */}
          {currentQuestion.options.map((option, optionIndex) => {
            const isSelected = selectedAnswers[currentQuestionIndex] === optionIndex;
            const isCorrect = currentQuestion.correctOption === optionIndex;
            const isIncorrect = isSelected && !isCorrect;

            return (
              <TouchableOpacity
                key={optionIndex}
                style={[
                  styles.optionButton,
                  colorScheme === "dark" ? styles.optionButtonDark : styles.optionButtonLight,
                  isSelected ? (colorScheme === "dark" ? styles.selectedOptionDark : styles.selectedOptionLight) : null,
                  submitted && isCorrect ? styles.correctOption : null,
                  submitted && isSelected && isIncorrect ? styles.incorrectOption : null,
                ]}
                onPress={() => handleAnswerSelect(currentQuestionIndex, optionIndex)}
                disabled={submitted}
              >
                <ThemedText
                  style={[
                    styles.optionText,
                    (isCorrect || isIncorrect) && submitted ? styles.submittedOptionText : null,
                  ]}
                >
                  {option.text}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
          
          {/* Explanation and Reference */}
          {submitted && currentQuestion.explanation && (
            <ThemedText style={styles.explanationText}>
              {`${currentQuestion.explanation}`}
            </ThemedText>
          )}
          {submitted && currentQuestion.reference && currentQuestion.reference.title && (
            <ThemedText style={styles.referenceText}>
              {`Reference: ${currentQuestion.reference.title}`}
              {currentQuestion.reference.link && (
                <Text style={{ color: "#3f51b5" }} onPress={() => Linking.openURL(currentQuestion?.reference?.link as string)}>
                  {currentQuestion.reference.link && `\n${currentQuestion.reference.link}`}
                </Text>
              )}
            </ThemedText>
          )}
        </View>

        {/* Navigation */}
        <View style={styles.navigationButtons}>
          <TouchableOpacity style={styles.navButton} onPress={handlePrevious} disabled={currentQuestionIndex === 0}>
            <MaterialIcons name="arrow-back" size={24} color={Colors[colorScheme??'dark'].text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={handleNext} disabled={currentQuestionIndex === questions.length - 1}>
            <MaterialIcons name="arrow-forward" size={24} color={Colors[colorScheme??'dark'].text} />
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        {
          !submitted && 
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={submitted}
          >
          <ThemedText style={styles.submitButtonText}>Submit Quiz</ThemedText>
        </TouchableOpacity>
        }
        

        {/* Score and Retry */}
        {submitted && (
          <View style={styles.scoreContainer}>
            <ThemedText style={styles.scoreText}>
              Your Score: {score} / {questions.length}
            </ThemedText>
            <View style={styles.retryHomeButtons}>
              <TouchableOpacity style={[
                  styles.retryButton,
                  dark? styles.retryButtonDark : styles.retryButtonLight
                ]} onPress={handleRetry}>
                <MaterialIcons name="replay" size={24} color={Colors[colorScheme??'dark'].text} />
              </TouchableOpacity>
              <TouchableOpacity style={[
                  styles.homeButton,
                  dark? styles.homeButtonDark : styles.homeButtonLight
                ]} onPress={() => router.replace("/")}>
              <MaterialIcons name="home" size={24} color={Colors[colorScheme??'dark'].text} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Score Modal */}
      <Modal visible={showScoreModal} transparent animationType="fade">
        <ThemedView style={styles.modalBackground}>
          <View style={[
            styles.modalContent,
            dark? styles.modalDark : styles.modalLight
          ]}>
            <MaterialIcons
              name="close"
              size={24}
              color={Colors[colorScheme??'dark'].text}
              style={styles.closeIcon}
              onPress={() => setShowScoreModal(false)}
            />
            <ThemedView>
              <ThemedText style={styles.modalScore}>Score: {score}/{questions.length}</ThemedText>
              <ThemedText style={styles.modalRemark}>{getRemark()}</ThemedText>
            </ThemedView>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={handleRetry}>
                <MaterialIcons name="replay" size={30} color={Colors[colorScheme??'dark'].text} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.replace("/")}>
                <MaterialIcons name="home" size={30} color={Colors[colorScheme??'dark'].text} />
              </TouchableOpacity>
            </View>
          </View>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}


const styles = StyleSheet.create({
  darkContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.dark.background,
  },
  lightContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.light.background,
  },
  scrollContainer: {
    paddingBottom: 2,
    flexDirection: "column",
    gap: 8,
  },
  headerStyle: {
    display: "flex",
    padding: 12,
    marginBottom: 10,
    backgroundColor: "transparent"
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center"
  },
  questionContainer: {
    marginBottom: 16,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  optionButton: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  selectedOptionLight: {
    backgroundColor: "#b7b7b7",
  },
  selectedOptionDark: {
    backgroundColor: "#6b6b6b",
  },
  optionButtonLight: {
    backgroundColor: "#dedede",
  },
  optionButtonDark: {
    backgroundColor: "#404040",
  },
  optionText: {
    fontSize: 15,
  },
  submittedOptionText: {
    color: "#ffffff",
    fontWeight: "bold"
  },
  correctOption: {
    backgroundColor: "#4caf50", // Green for correct
    borderColor: "#388e3c", // Dark green border for correct answers
  },
  incorrectOption: {
    backgroundColor: "#f44336", // Red for incorrect
    borderColor: "#d32f2f", // Dark red border for incorrect answers
  },
  explanationText: {
    fontSize: 14,
    fontStyle: "italic",
    marginTop: 10,
  },
  referenceText: {
    fontSize: 14,
    marginTop: 10,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  progressBar: {
    height: 8,
    width: "100%",
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginTop: 5,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3f51b5",
    borderRadius: 5,
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 0,
  },
  navButton: {
    padding: 12,
    borderRadius: 5,
  },
  navButtonText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#3f51b5",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  submitButtonText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
  scoreContainer: {
    marginTop: 20,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
  },
  scoreText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  retryHomeButtons: {
    flexDirection: "row",
    justifyContent: "center",
    width: "80%",
    gap: 8
  },
  retryButton: {
    padding: 12,
    borderRadius: 8,
  },
  retryButtonDark: {
    backgroundColor: "#404040",
  },
  retryButtonLight: {
    backgroundColor: "#d3d3d3",
  },
  retryButtonText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 16,
  },
  homeButton: {
    padding: 12,
    borderRadius: 8,
  },
  homeButtonDark: {
    backgroundColor: "#404040",
  },
  homeButtonLight: {
    backgroundColor: "#d3d3d3",
  },
  homeButtonText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.85)",
  },
  modalDark: {
    backgroundColor: Colors['dark'].background,
  },
  modalLight: {
    backgroundColor: Colors['light'].background,
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    alignItems: "flex-start",
    width: "70%",
  
  },
  closeIcon: {
    alignSelf: "flex-end",
    marginBottom: 0,
  },
  modalScore: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#04b31b",
  },
  modalRemark: {
    fontSize: 24,
    marginVertical: 10,
    fontWeight: "bold",
    lineHeight: 30
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    gap: 30,
    marginTop: 10,
  },
});