import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Modal, Button, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import PagerView from 'react-native-pager-view';

interface Book {
  id: string;
  name: { th: string; en: string };
  description: { th: string; en: string };
  bookImage: string;
  status: string;
  quantity: number;
  ISBN: string;
}

export default function BookPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Fetch books from the API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://192.168.1.37:8082/api/books/');
        const updatedBooks = response.data.data.map((book: Book) => ({
          ...book,
          bookImage: book.bookImage.replace('http://127.0.0.1', 'http://192.168.1.37'), // Replace 127.0.0.1 with your local IP
        }));
        setBooks(updatedBooks);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const openModal = (book: Book) => {
    setSelectedBook(book);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedBook(null);
  };

  // Pagination logic (6 items per page)
  const renderPage = (data: Book[]) => (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      numColumns={2}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => openModal(item)}>
          <Image source={{ uri: item.bookImage }} style={styles.bookImage} />
          <Text style={styles.bookName}>{item.name.en}</Text>
        </TouchableOpacity>
      )}
    />
  );

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  // Split books into chunks of 6 per page
  const chunkedBooks = books.reduce((resultArray: Book[][], item, index) => { 
    const chunkIndex = Math.floor(index / 6);
    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []; // start a new chunk
    }
    resultArray[chunkIndex].push(item);
    return resultArray;
  }, []);

  return (
    <View style={styles.container}>
      <PagerView style={styles.pager} initialPage={0}>
        {chunkedBooks.map((page, index) => (
          <View key={index} style={styles.page}>
            {renderPage(page)}
          </View>
        ))}
      </PagerView>

      {/* Modal for book details */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalView}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            {selectedBook && (
              <>
                <Image source={{ uri: selectedBook.bookImage }} style={styles.modalImage} />
                <Text style={styles.modalTitle}>{selectedBook.name.en}</Text>
                <Text style={styles.modalDescription}>{selectedBook.description.en}</Text>
                <Text style={styles.modalDetails}>Status: {selectedBook.status}</Text>
                <Text style={styles.modalDetails}>Quantity: {selectedBook.quantity}</Text>
                <Text style={styles.modalDetails}>ISBN: {selectedBook.ISBN}</Text>
                <Button title="Reserve this book" onPress={() => { /* Placeholder */ }} />
                <Button title="Close" onPress={closeModal} />
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20 },
  pager: { flex: 1 },
  page: { padding: 10, flex: 1 },
  card: { flex: 1, margin: 10, backgroundColor: '#e7e7e7', borderRadius: 10, padding: 10 },
  bookImage: { width: 100, height: 150, resizeMode: 'contain' },
  bookName: { textAlign: 'center', marginTop: 10 },
  modalView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { backgroundColor: '#e7e7e7', padding: 20, borderRadius: 10, alignItems: 'center' },
  modalImage: { width: 200, height: 300, marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  modalDescription: { fontSize: 16, marginBottom: 10 },
  modalDetails: { fontSize: 14, marginBottom: 5 },
});
