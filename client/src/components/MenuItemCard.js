import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import commonStyles from '../styles/commonStyles';

const MenuItemCard = ({ item, onOrder }) => {
  return (
    <View style={commonStyles.menuItemContainer}>
      <Image
        source={{ uri: item.imageUrl }}
        style={commonStyles.menuItemImage}
        resizeMode="cover"
      />
      <View style={commonStyles.menuItemInfo}>
        <Text style={commonStyles.menuItemName}>{item.name}</Text>
        {item.description ? (
          <Text style={commonStyles.menuItemDescription}>{item.description}</Text>
        ) : null}
        <Text style={commonStyles.menuItemPrice}>R$ {item.price.toFixed(2)}</Text>
        <TouchableOpacity style={commonStyles.orderButton} onPress={() => onOrder(item.id)}>
          <Text style={commonStyles.orderButtonText}>Fazer Pedido</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MenuItemCard;
