import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text } from "react-native";

interface Props {
  item: PropTypes.InferProps<{
      id: number,
      is_completed: boolean,
      text: string
    }>
}

const TodoItem: React.FC<Props> = ({ item}) => {
  return <Text style={styles.item}>{item?.text}</Text>;
};

TodoItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number,
    is_completed: PropTypes.bool,
    text: PropTypes.string
  }).isRequired
};

const styles = StyleSheet.create({
  item: {
    padding: 10,
    fontSize: 24
  }
});

export default TodoItem;