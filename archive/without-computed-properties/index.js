var app = new Vue({
  el: "#app",
    data: {
    product: "Socks",
    image: "./assets/green.jpg",
    moreinfo: "https://www.socks.com/",
    inventory: 10,
    inStock: true,
    // inStock: false,
    cart: 0,
    details: ["80% cotton", "20% polyester", "Male"],
    variants: [
      {
        id: 1,
        color: "green",
        variantImage: "./assets/green.jpg"
      },
      {
        id: 2,
        color: "blue",
        variantImage: "./assets/blue.jpg"
      }
    ]
  },
  methods: {
    addToCart: function() {
      this.cart += 1;
    },
    removeFromCart: function() {
      if (this.cart != 0) {
        this.cart -= 1;
      }
    },
    updateImage: function(variantImage) {
      this.image = variantImage;
    }
    }
});

/*
With ES6 syntax,

addToCart() {
    this.cart += 1;
},
removeFromCart() {
    if (this.cart != 0) {
    this.cart -= 1;
    }
    }

}
*/
