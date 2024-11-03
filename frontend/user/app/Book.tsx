import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Book {
  id: string;
  name: { th: string; en: string };
  description: { th: string; en: string };
  bookImage: string;
  category: { id: string; name: { th: string; en: string } };
  status: string;
  quantity: number;
  ISBN: string;
}

export default function BookPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");

  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://172.27.72.20:8082/api/books/");
      const updatedBooks = response.data.data.map((book: Book) => ({
        ...book,
        bookImage: book.bookImage.replace(
          "http://127.0.0.1",
          "http://172.27.72.20"
        ),
      }));
      setBooks(updatedBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        "http://172.27.72.20:8082/api/users/profile"
      );
      setUsername(response.data.username);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBooks();
      fetchProfile();
    }, [])
  );

  const openModal = (book: Book) => {
    setSelectedBook(book);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedBook(null);
  };

  const filteredBooks = books.filter((book) =>
    book.name.en.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <ImageBackground
      imageStyle={{ backgroundColor: "#FFFFFF" }}
      style={styles.background}
    >
      <View
        style={{
          alignItems: "flex-start",
          marginLeft: 10,
          marginRight: 10,
          borderBottomColor: "gray",
          paddingBottom: 4,
          borderBottomWidth: 2,
        }}
      >
        <Text style={{ fontSize: 25, fontWeight: "bold", paddingTop: 10 }}>
          All Books
        </Text>
      </View>
      <View style={styles.container}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search books..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => openModal(item)}
            >
              <Image
                source={{ uri: item.bookImage }}
                style={styles.bookImage}
              />
              <Text style={styles.bookName}>{item.name.en}</Text>

              <Text>
                Status:
                <Text
                  style={[
                    styles.bookStatus,
                    { color: item.status === "ready" ? "green" : "red" },
                  ]}
                >
                  {item.status}
                </Text>
              </Text>
            </TouchableOpacity>
          )}
        />
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modal}>
              {selectedBook && (
                <View style={styles.modalContent}>
                  <Image
                    source={{ uri: selectedBook.bookImage }}
                    style={styles.modalImage}
                  />
                  <Text style={styles.modalTitle}>{selectedBook.name.en}</Text>
                  <Text style={styles.modalDescription}>
                    Description: {selectedBook.description.en}
                  </Text>
                  <Text style={styles.modalDetails}>
                    Quantity: {selectedBook.quantity}
                  </Text>
                  <Text style={styles.modalDetails}>
                    ISBN: {selectedBook.ISBN}
                  </Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={closeModal}
                  >
                    <Ionicons
                      name="arrow-back-circle"
                      size={40}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 3, paddingTop: 10 },
  searchBar: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    margin: 10,
    paddingLeft: 8,
    borderRadius: 20,
  },
  card: {
    flex: 5,
    margin: 10,
    borderRadius: 15,
    height: 350,
    alignItems: "center",
    overflow: "hidden",
  },
  bookImage: {
    width: "100%",
    height: "80%",
    resizeMode: "cover",
    borderRadius: 15,
  },
  bookName: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  bookStatus: { color: "#9400FF", fontSize: 15, fontWeight: "bold" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: {
    flex: 0,
    width: "60%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  modalImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 20,
    resizeMode: "contain",
  },
  modalContent: {
    width: "100%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: "gray",
  },
  modalDescription: {
    fontSize: 17,
    marginBottom: 5,
  },
  modalDetails: {
    fontSize: 17,
    marginBottom: 5,
  },
  background: { flex: 1 },
  closeButton: {
    marginTop: 17,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
});
