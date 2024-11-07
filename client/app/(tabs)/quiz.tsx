import React, { useState, useEffect, useRef } from 'react';
import { Text, StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { useRecoilValue } from 'recoil';
import { userAtom } from '@/store/atoms/user';
import { Colors } from '@/constants/Colors';

export default function TabTwoScreen() {
  const colorScheme = useColorScheme(); 
  const user = useRecoilValue(userAtom);
  const router = useRouter();

  const [selectedAnswers, setSelectedAnswers] = useState(Array(ayurvedaMCQs.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(()=>{
    if(!user.isLoggedIn) router.replace('/')
  }, [])

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
      if (answer === ayurvedaMCQs[index].answer) {
        calculatedScore += 1;
      }
    });
    setScore(calculatedScore);
    setSubmitted(true);

    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleRetry = () => {
    setSelectedAnswers(Array(ayurvedaMCQs.length).fill(null)); // Clear selected answers
    setScore(0); // Reset score
    setSubmitted(false); // Reset submission state
  };

  return (
    <ThemedView style={colorScheme==='dark' ? styles.darkContainer : styles.lightContainer}>
    
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContainer}>
        {/* Score */}
        {submitted && (
          <View style={styles.scoreContainer}>
            <ThemedText style={styles.scoreText}>
              Your Score: {score} / {ayurvedaMCQs.length}
            </ThemedText>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleRetry}
            >
              <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
            </TouchableOpacity>
          </View>
        )}
        
        {ayurvedaMCQs.map((questionObj, questionIndex) => (
          <View key={questionIndex} style={styles.questionContainer}>
            <ThemedText style={styles.questionText}>{`${questionIndex + 1}. ${questionObj.question}`}</ThemedText>
            {questionObj.options.map((option, optionIndex) => {
              // Check if the option is correct or incorrect
              const isSelected = selectedAnswers[questionIndex] === optionIndex;
              const isCorrect = ayurvedaMCQs[questionIndex].answer === optionIndex;
              const isIncorrect = isSelected && !isCorrect;

              return (
                <TouchableOpacity
                  key={optionIndex}
                  style={[
                    styles.optionButton,
                    colorScheme==='dark'?styles.optionButtonDark:styles.optionButtonLight,
                    isSelected ? colorScheme==='dark' ? styles.selectedOptionDark : styles.selectedOptionLight : null,
                    submitted && isCorrect ? styles.correctOption : null,
                    submitted && isSelected && isIncorrect ? styles.incorrectOption : null,
                  ]}
                  onPress={() => handleAnswerSelect(questionIndex, optionIndex)}
                  disabled={submitted} // Disable options after submission
                >
                  <ThemedText style={[
                    styles.optionText,
                    (isCorrect || isIncorrect) && submitted ? styles.submittedOptionText : null
                  ]}>{option}</ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}


        <TouchableOpacity 
          style={{
            backgroundColor: Colors[colorScheme??'dark'].tint,
            padding: 8,
            borderRadius: 8,
            display: submitted? 'none':'flex',
          }} 
          onPress={handleSubmit} 
          disabled={submitted}>
          <Text
            style={{ 
              color: Colors[colorScheme??'dark'].background,
              fontSize: 18,
              textAlign: 'center',
              fontWeight: '600'
            }}
          >Submit Quiz</Text>
        </TouchableOpacity>

        
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  darkContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.dark.containerBackground
  },
  lightContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.light.containerBackground
  },
  scrollContainer: {
    paddingBottom: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  },
  questionContainer: {
    marginBottom: 16,
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionButton: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  selectedOptionLight: {
    backgroundColor: '#dedede'
  },
  selectedOptionDark: {
    backgroundColor: '#363535'
  },
  optionButtonLight: {
    backgroundColor: Colors.light.background,
  },
  optionButtonDark: {
    backgroundColor: Colors.dark.background
  },
  optionText: {
    fontSize: 15,
  },
  submittedOptionText: {
    color: '#000000',
  },
  correctOption: {
    backgroundColor: '#c8e6c9', // Green for correct
    borderColor: '#388e3c', // Dark green border for correct answers
  },
  incorrectOption: {
    backgroundColor: '#ffcdd2', // Red for incorrect
    borderColor: '#d32f2f', // Dark red border for incorrect answers
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  scoreContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 4,
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 8,
    padding: 4
  },
  retryButton: {
    backgroundColor: '#3f51b5', // Blue background for retry button
    padding: 8,
    borderRadius: 4,
    width: 160
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

const ayurvedaMCQs = [
  { question: "Which of the following is known as the science of life in Ayurveda?", options: ["Pranayama", "Panchakarma", "Rasayana", "Ayurveda"], answer: 3 },
  { question: "Which of the following is NOT one of the three doshas in Ayurveda?", options: ["Vata", "Pitta", "Kapha", "Prana"], answer: 3 },
  { question: "In Ayurveda, what does 'Agni' refer to?", options: ["Wind", "Water", "Digestive Fire", "Earth"], answer: 2 },
  { question: "Which of these is a common Ayurvedic herb used for boosting immunity?", options: ["Ashwagandha", "Garlic", "Eucalyptus", "Thyme"], answer: 0 },
  { question: "According to Ayurveda, which dosha is associated with qualities of lightness, cold, and movement?", options: ["Kapha", "Pitta", "Vata", "Prana"], answer: 2 },
  { question: "What is Panchakarma in Ayurveda?", options: ["A type of yoga", "A detoxification process", "A meditation technique", "A type of Ayurvedic massage"], answer: 1 },
  { question: "Which Ayurvedic text is considered the foundational text?", options: ["Sushruta Samhita", "Bhagavad Gita", "Charaka Samhita", "Upanishads"], answer: 2 },
  { question: "Which of the following is used to balance Pitta dosha?", options: ["Pepper", "Turmeric", "Mint", "Ginger"], answer: 2 },
  { question: "What does Ayurveda recommend for better sleep?", options: ["Reading before bed", "Drinking warm milk", "Exercising at night", "Listening to music"], answer: 1 },
  { question: "According to Ayurveda, which season aggravates the Kapha dosha?", options: ["Summer", "Winter", "Spring", "Monsoon"], answer: 2 },
  { question: "Which of these herbs is used in Ayurveda for mental clarity and memory enhancement?", options: ["Neem", "Brahmi", "Ashwagandha", "Tulsi"], answer: 1 },
  { question: "Which dosha is associated with fire and water elements in Ayurveda?", options: ["Vata", "Kapha", "Pitta", "Prana"], answer: 2 },
  { question: "What is the primary focus of Ayurveda?", options: ["Curing diseases", "Maintaining balance in mind, body, and spirit", "Performing physical exercises", "Practicing strict diet control"], answer: 1 },
  { question: "In Ayurveda, which taste is recommended to balance Vata dosha?", options: ["Bitter", "Sweet", "Pungent", "Sour"], answer: 1 },
  { question: "Which Ayurvedic herb is known as 'Indian Ginseng'?", options: ["Ashwagandha", "Brahmi", "Shatavari", "Triphala"], answer: 0 }
];
