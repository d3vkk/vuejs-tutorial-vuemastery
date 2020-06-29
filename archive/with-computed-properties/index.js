var app = new Vue({
  el: "#app",
  data: {
    brand: "Jivanci",
    product: "Socks",
    selectedVariant: 0,
    moreinfo: "https://www.socks.com/",
    inventory: 10,
    cart: 0,
    details: ["80% cotton", "20% polyester", "Male"],
    variants: [
      {
        id: 1,
        color: "green",
        variantImage: "./assets/green.jpg",
        variantQuantity: 10
      },
      {
        id: 2,
        color: "blue",
        variantImage: "./assets/blue.jpg",
        variantQuantity: 0
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
    updateImage: function(index) {
      this.selectedVariant = index;
    }
  },
  /*
        COMPUTED PROPERTIES
        Best used to reduce redundancy of using methods,
        as values will not have to be changed repetitively

        For the image:
        When the image is updated with the updateImage function,
        the selectedVariant takes on the value of the index.

        The computed property of the image is returned.
        variants is an array & the variantImage attribute specified in the JSON above is attached to it.

        The same thing is done for the inStock computed property
        as it depends on the variantQuantity atribute specified in the JSON above

    */
  computed: {
    title: function() {
      return this.brand + " " + this.product;
    },
    image: function() {
      return this.variants[this.selectedVariant].variantImage;
    },
    inStock: function() {
      return this.variants[this.selectedVariant].variantQuantity;
    }
  }
});

app.brand = "Kawangware";

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
