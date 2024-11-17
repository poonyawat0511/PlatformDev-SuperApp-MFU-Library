import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import DetailDialog from "@/components/libraryDialog/detailDialog";
import BooksCard from "@/components/libraryTable/booksCard";
import { Books } from "@/utils/api/interfaces/books";
import apiClient from "@/utils/api/libraryApi/apiClient";
import { useFocusEffect } from "@react-navigation/native";
import { Category } from "@/utils/api/interfaces/categories";

export default function BookPage() {
  const [books, setBooks] = useState<Books[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Books | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const ipAddress = `http://192.168.0.201`;

  const fetchBooks = async () => {
    try {
      const response = await apiClient.get("/books/");
      const updatedBooks = response.data.data.map((book: Books) => ({
        ...book,
        bookImage: book.bookImage.replace("http://127.0.0.1", `${ipAddress}`),
      }));
      setBooks(updatedBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get("/book-categories");
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.name.en
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesCategory =
      !selectedCategory || book.category.id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <ImageBackground
      imageStyle={{ backgroundColor: "#FFFFFF" }}
      style={styles.background}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>All Books</Text>
      </View>

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

      {/* Categories Filter */}
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal>
          <TouchableOpacity
            style={[
              styles.categoryButton,
              !selectedCategory && styles.selectedCategoryButton,
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text
              style={[
                styles.categoryText,
                !selectedCategory && styles.selectedCategoryText,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id &&
                  styles.selectedCategoryButton,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.id &&
                    styles.selectedCategoryText,
                ]}
              >
                {category.name.en}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item.id}
        horizontal={true}
        contentContainerStyle={styles.flatListContentHorizontal}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <BooksCard book={item} onPress={openModal} />
          </View>
        )}
        snapToAlignment="center"
        snapToInterval={310}
        decelerationRate="fast"
      />

      <DetailDialog
        visible={isModalVisible}
        book={selectedBook}
        onClose={closeModal}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  headerContainer: {
    alignItems: "flex-start",
    marginLeft: 10,
    marginRight: 10,
    borderBottomColor: "gray",
    paddingBottom: 4,
    borderBottomWidth: 2,
  },
  headerText: { fontSize: 40, fontWeight: "bold", paddingTop: 10 },
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
  searchIcon: { position: "absolute", right: 25, zIndex: 1 },
  searchBar: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    margin: 10,
    paddingLeft: 20,
    borderRadius: 20,
    flex: 1,
  },
  categoriesContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginVertical: 10,
    marginLeft: 20,
  },
  categoryButton: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: "#EEE",
    borderRadius: 50,
  },
  selectedCategoryButton: {
    backgroundColor: "#CCC",
  },
  categoryText: {
    fontSize: 16,
    color: "#000",
  },
  selectedCategoryText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  flatListContentHorizontal: {
    paddingHorizontal: 10,
  },
  cardContainer: {
    width: 300,
    marginHorizontal: 5,
  },
});
