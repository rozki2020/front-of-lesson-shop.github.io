var app = new Vue({
  el: "#app",
  data: {
    sitename: "After School Classes",
    showProduct: true,
    order: {
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      zip: "",
      state: "",
      method: "Home",
      gift: false,
      sendGift: "Send as a gift",
      dontSendGift: "Do not send as a gift",
    },
    states: {
      AL: "Alabama",
      AR: "Arizona",
      CA: "California",
      NV: "Nevada",
    },
    lessons: [
      {
        id: 1001,
        subject: "Math",
        location: "London",
        price: 100,
        spaces: 5,
        image: "fas fa-calculator",
      },
      {
        id: 1002,
        subject: "English",
        location: "Oxford",
        price: 120,
        spaces: 5,
        image: "fas fa-book",
      },
      {
        id: 1003,
        subject: "Science",
        location: "Cambridge",
        price: 90,
        spaces: 5,
        image: "fas fa-flask",
      },
      {
        id: 1004,
        subject: "History",
        location: "York",
        price: 80,
        spaces: 5,
        image: "fas fa-landmark",
      },
      {
        id: 1005,
        subject: "Music",
        location: "Bristol",
        price: 150,
        spaces: 5,
        image: "fas fa-music",
      },
      {
        id: 1006,
        subject: "Art",
        location: "Manchester",
        price: 110,
        spaces: 5,
        image: "fas fa-palette",
      },
      {
        id: 1007,
        subject: "PE",
        location: "Liverpool",
        price: 70,
        spaces: 5,
        image: "fas fa-running",
      },
      {
        id: 1008,
        subject: "Geography",
        location: "Leeds",
        price: 85,
        spaces: 5,
        image: "fas fa-globe-europe",
      },
      {
        id: 1009,
        subject: "Coding",
        location: "London",
        price: 200,
        spaces: 5,
        image: "fas fa-laptop-code",
      },
      {
        id: 1010,
        subject: "Drama",
        location: "Oxford",
        price: 130,
        spaces: 5,
        image: "fas fa-theater-masks",
      },
    ],
    cart: [],
    sortBy: "subject",
    sortOrder: "asc",
    searchQuery: "",
    maxPrice: 200,
    sortOptions: {
      Subject: "subject",
      Location: "location",
      Price: "price",
      Spaces: "spaces",
    },
  },
  methods: {
    addToCart(lesson) {
      this.cart.push(lesson.id);
      lesson.spaces--;
    },
    showCheckout() {
      this.showProduct = this.showProduct ? false : true;
    },
    submitForm() {
      alert("Order submitted!");
      // Reset logic could go here
      this.cart = [];
      this.showProduct = true;
      this.lessons.forEach((lesson) => (lesson.spaces = 5)); // Reset spaces for demo
    },
    canAddToCart(lesson) {
      return lesson.spaces > 0;
    },
    cartCount(id) {
      let count = 0;
      for (let i = 0; i < this.cart.length; i++) {
        if (this.cart[i] === id) {
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
        const lesson = this.lessons.find((l) => l.id === lessonId);
        if (lesson) {
          lesson.spaces++;
        }
      }
    },
    getLessonById(id) {
      return this.lessons.find((l) => l.id === id);
    },
  },
  computed: {
    cartItemCount() {
      return this.cart.length || "";
    },
    sortedLessons() {
      let lessonsArray = this.lessons.slice(0);

      // Filter by search
      if (this.searchQuery) {
        const lowerSearch = this.searchQuery.toLowerCase();
        lessonsArray = lessonsArray.filter(
          (lesson) =>
            lesson.subject.toLowerCase().includes(lowerSearch) ||
            lesson.location.toLowerCase().includes(lowerSearch)
        );
      }

      // Filter by price
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
      this.cart.forEach((id) => {
        counts[id] = (counts[id] || 0) + 1;
      });

      return Object.keys(counts).map((id) => {
        const lesson = this.lessons.find((l) => l.id == id);
        return {
          ...lesson,
          count: counts[id],
        };
      });
    },
    cartTotal() {
      return this.cart.reduce((total, id) => {
        const lesson = this.lessons.find((l) => l.id == id);
        return total + (lesson ? lesson.price : 0);
      }, 0);
    },
    isFormValid() {
      return this.order.firstName && this.order.lastName && this.order.phone;
    },
  },
});
