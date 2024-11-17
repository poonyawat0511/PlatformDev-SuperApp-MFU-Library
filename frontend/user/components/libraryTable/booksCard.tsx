import React from "react";
import { Books } from "@/utils/api/interfaces/books";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface BooksCardProps {
  book: Books;
  onPress: (book: Books) => void;
}

export default function BooksCard({ book, onPress }: BooksCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(book)}>
      <Image source={{ uri: book.bookImage }} style={styles.bookImage} />
      <Text style={styles.bookName}>{book.name.en}</Text>
      <Text>
        Status:
        <Text
          style={[
            styles.bookStatus,
            { color: book.status === "ready" ? "green" : "red" },
          ]}
        >
          {book.status}
        </Text>
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
    borderRadius: 30,
  },
  bookName: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  bookStatus: { fontSize: 15, fontWeight: "bold" },
});
