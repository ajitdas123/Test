import React, { Component } from 'react';
import {AsyncStorage} from 'react-native';
import md5 from "react-native-md5";


export default class cartApi extends Component{


  //Public methods
  static addToCart(id,name,qnty,price,discount=0,tax=0,options={}){
    console.log('Add to cart is called');
    console.log(id);
      console.log(name);
      console.log(qnty);
    let   product={
        id:id,
        name:name,
        qty:qnty,
        price:price,
        discount:discount,
        tax:tax,
        options:options
      };
      let cartResponse={};
      console.log(product);
      const hashItem = product;
      product.rowId = this.generateHash(hashItem);
      console.log(product);

        AsyncStorage.getItem('CART').then((data) => {
          //Check if the product already in the cartTotalItem
          if (data !== null && data.length>0) {
              if (this.checkIfExist(product.rowId)) {
                //Update product quantity
                data[product.rowId]['qty'] += product.qty;
              }else{
                //Add add product to the storage
                data[product.rowId] = product;
              }
              //Update storage with new data
              AsyncStorage.setItem("CART", data);
              cartResponse = data;
          }else{
            let cartItem ={};
            cartItem[product.rowId] =product;
              AsyncStorage.setItem("CART", cartItem);
              cartResponse =cartItem;
          }
            return true;
        }).catch(error => {
          console.log("Getting cart data error",error);
          return false;
        });
  }


    //Update cart quantity
    static updateCart(hash,qnty){
        try{
          AsyncStorage.getItem('CART').then((data) => {
            //Update data quantity
            data[hash]['qty'] =qnty;
            AsyncStorage.setItem("CART", data);
          });
          return true;
        }catch(err) {
          console.log(err.message);
          return false;
        }
    }

    //Delete item from the cart
    static deleteCartItem(hash){
      try{
        AsyncStorage.getItem('CART').then((data) => {
          //Update the cart with new data
          delete data[hash];
          AsyncStorage.setItem("CART", data);
        });
        return true;
      }catch(err) {
        console.log(err.message);
        return false;
      }
    }

    //Cart total items
    static cartTotalItem(){
        let totalItem='';
        AsyncStorage.getItem('CART').then((data) => {
          totalItem = data.length;
        });
        return totalItem;
    }

    //Get grand total of the cart
    static cartGrandTotal(withDiscount=true){
      let discount =0;
      let price =0;
      AsyncStorage.getItem('CART').then((data) => {
        for (var key in cart) {
            	discount +=cart[key]['discount'];
            	price += price+cart[key]['price'];
          }
      });
      if (withDiscount) {
        return price -discount;
      }else{
        return price;
      }
    }

    //Cart total discount
    static cartTotalDiscount(){
      let discount =0;
      let price =0;
      AsyncStorage.getItem('CART').then((data) => {
        for (var key in cart) {
              discount +=cart[key]['discount'];
          }
      });
      return discount;
    }


    //Private cartFunction
    static generateHash(param){
      let a =JSON.parse(JSON.stringify(param));
      delete a.qty;
      let hash = md5.hex_md5(a);
      return hash;
    }

     static checkIfExist(rowId){
      AsyncStorage.getItem('CART').then((data) => {
          if (data.hasOwnProperty(rowId)) {
            return true;
          }
      }).catch(error => {
        return false;
        console.log(error);
      });
      return false;
    }
}
