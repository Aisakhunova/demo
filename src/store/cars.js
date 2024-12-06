import { defineStore } from "pinia";

export const useCarsStore = defineStore('cars', {
  state: () => ({
    cars: [
      {
        id: 1,
        city: 'Познань',
        model: 'Toyota Corolla',
        price: 20000,
        available: true,
        images: [
          "https://i.ytimg.com/vi/GZIsGTcMWu0/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDpnOlgHMtHB2MmLGyAsdpO7-ka7A",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdxtYqIeKoq7KKLFyywy_wpr2jW_xiIQzj1w&s",
        ],
        year: 2021,
        engineType: 'V4',
        transmission: 'Automatic',
        fuel: 'Gasoline',
        description: 'Reliable sedan for everyday use.',
        checkboxes: ['Sunroof', 'Leather Seats'],
      },
      {
        id: 2,
        city: 'Краков',
        model: 'Honda Civic',
        price: 23000,
        available: true,
        images: [
          "https://automobiles.honda.com/-/media/Honda-Automobiles/Vehicles/2025/civic-sedan/non-VLP/10-Family/MY25_Civic_Family_Card_Jelly_Hybrid_2x.jpg?sc_lang=en",
          'https://di-uploads-pod11.dealerinspire.com/hondaofkirkland/uploads/2019/12/2020-Civic-Sedan-dashboard.png'
        ],
        year: 2020,
        engineType: 'V4',
        transmission: 'Manual',
        fuel: 'Gasoline',
        description: 'Sporty and fuel-efficient.',
        checkboxes: ['Backup Camera', 'Bluetooth'],
      },
      {
        id: 3,
        city: 'Варшава',
        model: 'Ford Focus',
        price: 21000,
        available: true,
        images: [
          "https://c0.carsie.ie/d43864c90df075c94489ddbe4ca5ffe92d17be1f5053221b53bb4ff460538d17.jpg",
          'https://listing-images.motoscout24.ch/23/11684023/45172154.JPG?w=1920&q=90'
        ],
        year: 2019,
        engineType: 'V4',
        transmission: 'Automatic',
        fuel: 'Diesel',
        description: 'Compact and stylish with great performance.',
        checkboxes: ['Heated Seats', 'Apple CarPlay'],
      },
      {
        id: 4,
        city: 'Краков',
        model: 'Chevrolet Malibu',
        price: 25000,
        available: true,
        images: [
          "https://content.homenetiol.com/2000292/2143540/0x0/ed9d5c032cdd47ecafa5c34aa2330a5e.jpg",
          'https://dealerinspire-image-library-prod.s3.us-east-1.amazonaws.com/images/h1d9ZDwJUBKRo6hHocMhRw78qPRL3ZonbS9I44PO.jpg'
        ],
        year: 2022,
        engineType: 'V6',
        transmission: 'Automatic',
        fuel: 'Gasoline',
        description: 'Spacious and comfortable sedan for family trips.',
        checkboxes: ['Remote Start', 'Navigation System'],
      },
      {
        id: 5,
        city: 'Познань',
        model: 'Tesla Model 3',
        price: 35000,
        available: true,
        images: [
          "https://hips.hearstapps.com/hmg-prod/images/2023-tesla-model-3-103-1671468220.jpeg",
          'https://media.ed.edmunds-media.com/tesla/model-3/2022/oem/2022_tesla_model-3_sedan_performance_fq_oem_1_1600.jpg'
        ],
        year: 2023,
        engineType: 'Electric',
        transmission: 'Automatic',
        fuel: 'Electric',
        description: 'Innovative electric vehicle with autopilot.',
        checkboxes: ['Autopilot', 'Panoramic Roof'],
      },
      {
        id: 6,
        city: 'Варшава',
        model: 'BMW 3 Series',
        price: 40000,
        available: true,
        images: [
          "https://di-uploads-pod13.dealerinspire.com/bmwofomaha/uploads/2022/06/2022-BMW-3-SERIES.jpg",
          'https://dealerinspire-image-library-prod.s3.us-east-1.amazonaws.com/images/xcLdEmJZbeLIpCejVb4Ae4BDcNZgwMkuaYo3xNF6.jpg'
        ],
        year: 2022,
        engineType: 'V6',
        transmission: 'Automatic',
        fuel: 'Gasoline',
        description: 'Luxury sedan with premium features and sporty handling.',
        checkboxes: ['Harman Kardon Audio', 'Heads-Up Display'],
      },
    ],
    
    rentalRequests: [
      {
        id: 1,
        renterName: 'Иван Иванов',
        rentalStartDate: '2024-12-06',
        rentalEndDate: '2024-12-12',
        status: 'Pending',
        carId: 1,
      },
      {
        id: 2,
        renterName: 'Петр Петров',
        rentalStartDate: '2024-12-07',
        rentalEndDate: '2024-12-12',
        status: 'Approved',
        carId: 2,
      },
    ],
  }),

  actions: {
    addCar(car) {
      this.cars.push({ ...car, id: Date.now(), available: true });
    },
    updateCar(updatedCar) {
      const index = this.cars.findIndex(car => car.id === updatedCar.id);
      if (index !== -1) {
        this.cars[index] = updatedCar;
      }
    },
    deleteCar(id) {
      this.cars = this.cars.filter(car => car.id !== id);
    },
    getCarById(id) {
      return this.cars.find(car => car.id === id);
    },
    markAsUnavailable(carId) {
      const car = this.getCarById(carId);
      if (car) {
        car.available = false;
      }
    },
    addRentalRequest(request) {
      this.rentalRequests.push({ ...request, id: Date.now() });
      localStorage.setItem('rentalRequests', JSON.stringify(this.rentalRequests));
    },
    updateRentalRequest(requestId, updates) {
      const index = this.rentalRequests.findIndex(request => request.id === requestId);
      if (index !== -1) {
        this.rentalRequests[index] = { ...this.rentalRequests[index], ...updates };
        localStorage.setItem('rentalRequests', JSON.stringify(this.rentalRequests));
      }
    },
    getRentalStats() {
      const currentMonth = new Date().getMonth();
      const monthRequests = this.rentalRequests.filter(request => new Date(request.date).getMonth() === currentMonth);
      return monthRequests;
    },
    removeRequest(id) {
      this.rentalRequests = this.rentalRequests.filter(req => req.id !== id);
      localStorage.setItem('rentalRequests', JSON.stringify(this.rentalRequests));
    },
    fetchRentalRequests() {
      console.log("FETCHING - ", this.rentalRequests)
      return this.rentalRequests;
    },
    fetchCars() {
      return this.cars;
    },
    getCarRentalEndDate(carId) {
      const rental = this.rentalRequests.find(
        (request) => request.carId === carId && request.status === 'approved'
      );
      return rental ? rental.rentalEndDate : null;
    }
    
  },
});
