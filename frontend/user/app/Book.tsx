import DetailDialog from "@/components/libraryDialog/detailDialog";
import { Books } from "@/utils/api/interfaces/books";
import apiClient from "@/utils/api/libraryApi/apiClient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function BookPage() {
  const [books, setBooks] = useState<Books[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Books | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const ipAddress = `http://172.27.66.240`;

  const fetchBooks = async () => {
    try {
      const response = await apiClient.get("/books/");
      const updatedBooks = response.data.data.map((book: Books) => ({
        ...book,
        bookImage: book.bookImage.replace(
          "http://127.0.0.1",
          `${ipAddress}`
        ),
      }));
      setBooks(updatedBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBooks();
    }, [])
  );

  const openModal = (book: Books) => {
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
        <Text style={{ fontSize: 40, fontWeight: "bold", paddingTop: 10 }}>
          All Books
        </Text>
      </View>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="gray"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchBar}
            placeholder="Search books..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
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
        <DetailDialog
          visible={isModalVisible}
          book={selectedBook}
          onClose={closeModal}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 3, paddingTop: 10 },
  searchIcon: {
    position: "absolute",
    right: 25,
    zIndex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "gray",
    borderWidth: 1,
    margin: 10,
    paddingLeft: 5,
    borderRadius: 20,
    width: "90%",
    alignSelf: "center",
  },
  searchBar: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    margin: 10,
    paddingLeft: 20,
    borderRadius: 20,
    flex: 1,
  },
  card: {
    flex: 5,
    margin: 10,
    borderRadius: 15,
    height: 350,
    alignItems: "flex-start",
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
  bookStatus: { fontSize: 15, fontWeight: "bold" },
  background: { flex: 1 },
});
