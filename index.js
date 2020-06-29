//Will be used to transport events to their required functions
var EventBus = new Vue();

Vue.component("product", {
  /**
   * PROPS: a modifiable attribute that enables us to pass data to the template,
   * then from the template to the HTML.
   * It is also used to pass data from the main app or 'App.vue' to our components
   */
  props: {
    premium: {
      type: Boolean,
      required: true
      // default: true
    }
  },
  //A template is only allowed to have one root element
  template: `
    <!-- What is placed here is local i.e. for one product -->
    <div class="product">
                <div class="product-image">
                    <img v-bind:src="image">
                </div>

                <div class="product-info">
                        <h1> {{ title }} </h1>
                        <p v-if="inventory > 10">In Stock</p>
                        <p v-else-if="inventory <= 10 && inventory > 0">Almost out of stock</p>
                        <p v-else>Out of Stock</p>
                        <p>Shipping: {{ shipping }}</p>
                        <ul>
                            <li v-for="detail in details">{{ detail }}</li>
                        </ul>

                        <div v-for="(variant, index) in variants" :key="variant.id" class="color-box"
                            :style="{backgroundColor: variant.color}" @mouseover="updateImage(index)">
                            <!--
                                '@' is equivalent to 'v-on'
                                STYLE BINDING: variant.color is replaced with the actual color specified in index.js
                                COMPUTED PROPERTIES:
                                For the image:
                                The index takes on the same value as the variant and on mouse over, the function updateImage(index) is triggered, and it's value is passed to it.
                            -->
                        </div>

                        <br>
                        <a :href="moreinfo">More information</a>
                        <br>

                    <!--
                        COLOR BINDING:
                        The button is disbled when 'inStock is false'.
                        This triggers a css class - 'disabledButton' which changes the appearance of the button
                    -->
                    <button v-on:click="addToCart" :disabled="! inStock" :class="{ disabledButton: !inStock }">Add
                        to Cart</button>
                    <br>
                    <button v-on:click="removeFromCart" :disabled="! inStock" :class="{ disabledButton: !inStock }">Remove from Cart</button>
                    <!--
                        Note that no dashes ('-') are allowed in naming in CSS e.g. line-through
                    -->

                </div>
                <!--Reviews needs to be passed in to the product-tabs component to be used-->
                <product-tabs :reviews="reviews"></product-tabs>

            </div>
    `,
  data: function() {
    return {
      brand: "Jivanci",
      product: "Socks",
      selectedVariant: 0,
      moreinfo: "https://www.socks.com/",
      inventory: 10,
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
      ],
      reviews: []
    };
  },
  methods: {
    addToCart: function() {
      /*
        $emit broadcasts that an event has occured to the HTML
        Which catches it using a v-on event listener
      */
      this.$emit("add-to-cart", this.variants[this.selectedVariant].id);
    },
    removeFromCart: function() {
      this.$emit("remove-from-cart", this.variants[this.selectedVariant].id);
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
    },
    shipping: function() {
      //With booleans you don't have to equate them to a value
      if (this.premium) {
        return "Free";
      }
      return 2.99;
    }
  }
});

Vue.component("product-review", {
  template: `
    <!-- '.prevent' is a modifier that prevents the default behaviour of the page refreshing when we submit the form -->
    <!-- The ' action="" ' attribute is only used when we have external APIs or programs receiving the form input -->
    <form class="review-form" @submit.prevent="onSubmit">
        <p v-if="errors.length">
            <ul style="color:firebrick">
                <li v-for="error in errors">{{ error }}</li>
            </ul>
        </p>
        <p>
            <label for="name">Name:</label>
            <input id="name" v-model="name" >
        </p>
        <p>
            <label for="review">Review:</label>
            <textarea id="review" v-model="review"></textarea>
        </p>
        <p>
            <label for="rating">Rating:</label>
            <!-- '.number' is a modifier that makes sure the value retrieved is a number -->
            <select id="rating" v-model.number="rating">
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>
            </select>
        </p>
        <p>
            <label for="recommend">Would you recommend this product?</label>
            <input type="radio" name="recommend" value="Y" v-model="recommend">Yes
            <input type="radio" name="recommend" value="N" v-model="recommend">No
        </p>

        <p>
            <input type="submit" value="Submit">
        </p>
    </form>

    `,
  data: function() {
    return {
      name: null,
      review: null,
      rating: null,
      recommend: null,
      errors: []
    };
  },
  methods: {
    onSubmit: function() {
      if (this.name && this.review && this.rating && this.recommend) {
        /*
            ES6 syntax uses let instead of var when creating a variable.
            In this case we're creating an object
        */
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommend: this.recommend
        };
        EventBus.$emit("review-submitted", productReview);
        //What is below will reset the values after the form after submission
        this.name = null;
        this.review = null;
        this.rating = null;
        this.recommend = null;
      } else {
        //Generating errors
        if (!this.name) this.errors.push("Name required.");
        if (!this.review) this.errors.push("Review required.");
        if (!this.rating) this.errors.push("Rating required.");
        if (!this.recommend) this.errors.push("Recommendation required.");
      }
    }
  }
});

Vue.component("product-tabs", {
  props: {
    reviews: {
      type: Array,
      required: true
    }
  },
  template: `
        <div>
            <!--
                When user clicks on tab,
                selectedTab value is changed to what is selected
                The style is changed with the 'activeTab' class
            -->
            <span class="tab" :class="{ activeTab: selectedTab === tab}" v-for="(tab, index) in tabs" :key="index" @click="selectedTab = tab">{{ tab }}</span>

            <!--Shows only when selected tab is equal to Reviews-->
            <div v-show="selectedTab ===  'Reviews'">
                <h2>Reviews</h2>
                <p v-show="! reviews.length">There are no reviews yet.</p>
                <ul>
                    <li v-for="review in reviews">
                        <p>{{ review.name }}</p>
                        <p>{{ review.review }}</p>
                        <p>Rating: {{ review.rating }}</p>
                        <p>Recommended: {{ review.recommend }}</p>
                    </li>
                </ul>
            </div>

            <product-review  v-show="selectedTab ===  'Make a Review'"></product-review>

        </div>
    `,
  data: function() {
    return {
      tabs: ["Reviews", "Make a Review"],
      //Reviews is the default tab
      selectedTab: "Reviews"
    };
  },
    //This is a lifecycle hook as used in Vuex: Vue's state management
    mounted: function() {
      /*
        Will be listening for the review-submitted event
        and adding a review afterwards

        In ES6 syntax, arrow functions are used
        i.e '=>' instead of '= function ()'
       */
      EventBus.$on("review-submitted", productReview => {
        this.reviews.push(productReview);
      });
    }
});

var app = new Vue({
  el: "#app",
  data: {
    premium: true,
    // premium: false,
    cart: []
  },
  methods: {
    increaseCart: function(id) {
      //pushes or adds the id to the array and from the array into the HTML output
      this.cart.push(id);
    },
    decreaseCart: function(id) {
      //pops or removes the id to the array and from the array into the HTML output
      if (this.cart.length != 0) {
        this.cart.pop(id);
      }
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
