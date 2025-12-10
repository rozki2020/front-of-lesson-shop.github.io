var app = new Vue({
  el: "#app",
  data: {
    sitename: "After School Classes",
    showProduct: true,
    orderSubmitted: false,
    order: {
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      zip: "",
      method: "Home",
      gift: false,
      sendGift: "Send as a gift",
      dontSendGift: "Do not send as a gift",
    },

    lessons: [],
    cart: [],
    sortBy: "subject",
    sortOrder: "asc",
    searchQuery: "",
    maxPrice: 200,
    sortOptions: {
      Subject: "name",
      Location: "place",
      Price: "price",
      Spaces: "spacesLeft",
    },
  },
  created: function () {
    this.fetchActivities();
  },
  watch: {
    searchQuery: {
      handler(val) {
        this.searchActivities(val);
      },
    },
  },
  methods: {
    fetchActivities() {
      fetch("http://localhost:3000/collection/activities")
        .then((response) => response.json())
        .then((json) => {
          this.setLessons(json);
        });
    },
    setLessons(lessons) {
      this.cart.forEach((_id) => {
        const lesson = lessons.find((l) => l._id === _id);
        if (lesson) {
          lesson.spacesLeft--;
        }
      });
      this.lessons = lessons;
    },
    searchActivities(query) {
      const url = query
        ? `http://localhost:3000/collection/activities/search?q=${query}`
        : "http://localhost:3000/collection/activities";

      fetch(url)
        .then((response) => response.json())
        .then((json) => {
          this.setLessons(json);
        });
    },
    saveOrder(order) {
      fetch("http://localhost:3000/collection/orders/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      })
        .then((response) => response.json())
        .then((json) => {
          // alert("Order submitted!");
          this.cart = [];
          this.orderSubmitted = true;
          // this.showProduct = true;
        })
        .catch((error) => {
          console.error("Error submitting order:", error);
          alert("Failed to submit order");
        });
    },
    updateLessonSpaces(_id, spacesLeft) {
      fetch(`http://localhost:3000/collection/activities/${_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ spacesLeft: spacesLeft }),
      });
    },
    addToCart(lesson) {
      this.cart.push(lesson._id);
      lesson.spacesLeft--;
      this.updateLessonSpaces(lesson._id, 1);
    },
    showCheckout() {
      this.showProduct = this.showProduct ? false : true;
      if (!this.showProduct) {
        this.fetchActivities();
      }
    },
    submitForm() {
      const order = {
        ...this.order,
        lessonIDs: this.cart,
      };
      this.saveOrder(order);
    },
    canAddToCart(lesson) {
      return lesson.spacesLeft > 0;
    },
    cartCount(_id) {
      let count = 0;
      for (let i = 0; i < this.cart.length; i++) {
        if (this.cart[i] === _id) {
          count++;
        }
      }
      return count;
    },
    removeFromCart(lessonId) {
      const index = this.cart.indexOf(lessonId);
      if (index > -1) {
        this.cart.splice(index, 1);
        // Find lesson and increment spaces
        const lesson = this.lessons.find((l) => l._id === lessonId);
        if (lesson) {
          lesson.spacesLeft++;
          this.updateLessonSpaces(lesson._id, -1);
        }
      }
    },
    getLessonById(_id) {
      return this.lessons.find((l) => l._id === _id);
    },
    returnToStore() {
      this.orderSubmitted = false;
      this.showProduct = true;
    },
  },
  computed: {
    cartItemCount() {
      return this.cart.length || "";
    },
    sortedLessons() {
      let lessonsArray = this.lessons.slice(0);

      if (this.maxPrice > 0) {
        lessonsArray = lessonsArray.filter(
          (lesson) => lesson.price <= this.maxPrice
        );
      }

      // Then sort
      lessonsArray.sort((a, b) => {
        let modifier = 1;
        if (this.sortOrder === "desc") modifier = -1;

        if (a[this.sortBy] < b[this.sortBy]) return -1 * modifier;
        if (a[this.sortBy] > b[this.sortBy]) return 1 * modifier;
        return 0;
      });

      return lessonsArray;
    },
    cartItems() {
      // Return unique items in cart with their counts
      const counts = {};
      this.cart.forEach((_id) => {
        counts[_id] = (counts[_id] || 0) + 1;
      });

      return Object.keys(counts).map((_id) => {
        const lesson = this.lessons.find((l) => l._id == _id);
        return {
          ...lesson,
          count: counts[_id],
        };
      });
    },
    cartTotal() {
      return this.cart.reduce((total, _id) => {
        const lesson = this.lessons.find((l) => l._id == _id);
        return total + (lesson ? lesson.price : 0);
      }, 0);
    },
    isFormValid() {
      return (
        this.order.firstName &&
        this.order.lastName &&
        this.order.phone &&
        this.order.address &&
        this.order.city &&
        this.order.zip
      );
    },
  },
});
