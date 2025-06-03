import { StyleSheet } from 'react-native';

const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    padding: 10,
    marginVertical: 8,
    borderRadius: 4,
    width: '100%'
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 12,
    marginVertical: 8,
    borderRadius: 4,
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  linkText: {
    color: '#2196F3',
    marginTop: 12,
    textAlign: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
    textAlign: 'center'
  },
  menuList: {
    marginTop: 20
  },
  menuItemContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 6,
    overflow: 'hidden'
  },
  menuItemImage: {
    width: 100,
    height: 100,
    backgroundColor: '#F0F0F0'
  },
  menuItemInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between'
  },
  menuItemName: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#666666',
    marginVertical: 4
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4
  },
  orderButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: 'flex-start'
  },
  orderButtonText: {
    color: '#FFFFFF',
    fontSize: 14
  }
});

export default commonStyles;
