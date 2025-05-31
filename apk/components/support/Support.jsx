import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet,TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Platform,StatusBar,
} from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

import { url_api } from '../../impUrl';

const initialMessages = [
  {
    id: '1',
    text: 'Welcome to Bharat Transact Support. How can I help you today?',
    sender: 'support',
    time: '',
  },
];


const Support = ({ navigation }) => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const flatListRef = useRef();

  useEffect(() => {
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => prev.map(msg => 
      msg.id === '1' ? { ...msg, time: currentTime } : msg
    ));
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await axios.post(`${url_api}/api/chatBot/chat`, { message: input.trim() });
      
      if (response.data?.message) {
        const supportMessage = {
          id: Date.now().toString() + '_s',
          text: response.data.message,
          sender: 'support',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, supportMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const scrollToBottom = useCallback(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, []);

  const renderItem = useCallback(({ item }) => (
    <View
      style={[
        styles.messageRow,
        item.sender === 'user' ? styles.userRow : styles.supportRow,
      ]}
    >
      {item.sender === 'support' && (
        <View style={styles.avatarCircle}>
          <FontAwesome name="user-circle" size={28} color="#1F41B1" />
        </View>
      )}
      <View
        style={[
          styles.bubble,
          item.sender === 'user' ? styles.userBubble : styles.supportBubble,
        ]}
      >
        <Text style={[
          styles.bubbleText,
          item.sender === 'user' && styles.userBubbleText
        ]}>{item.text}</Text>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
      {item.sender === 'user' && (
        <View style={styles.avatarCircleUser}>
          <FontAwesome name="user" size={24} color="#fff" />
        </View>
      )}
    </View>
  ), []);

  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 4 : 0}
      >
        <LinearGradient
          colors={['#2563EB', '#1F41B1']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation?.goBack?.()}
            >
              <MaterialIcons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Support</Text>
            <View style={styles.backButton} />
          </View>
        </LinearGradient>
        <View style={styles.chatArea}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.chatContainer}
            onContentSizeChange={scrollToBottom}
            onLayout={scrollToBottom}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
          />
        </View>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            value={input}
            onChangeText={setInput}
            placeholderTextColor="#888"
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]} 
            onPress={handleSend}
            disabled={!input.trim()}
          >
            <MaterialIcons name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    flex: 1,
  },
  chatArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  chatContainer: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 12,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 18,
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  supportRow: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    padding: 14,
    borderRadius: 20,
    marginHorizontal: 8,
    marginBottom: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: '#2563EB',
    borderTopRightRadius: 6,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  supportBubble: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 6,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  bubbleText: {
    fontSize: 16,
    color: '#222',
  },
  userBubbleText: {
    color: '#fff',
  },
  timeText: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
    textAlign: 'right',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingBottom: Platform.OS === 'ios' ? 30 : 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#222',
    marginRight: 8,
    maxHeight: 80,
  },
  sendButton: {
    backgroundColor: '#1F41B1',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#A0AEC0',
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCircleUser: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
});

export default Support;