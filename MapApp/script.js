'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

let map
let mapEvent

let workouts = []

class Workout {
    date = new Date()
    id=(Date.now() + '').slice(-10)

    constructor(coords, distance, duration) {
        this.coords = coords
        this.distance = distance
        this.duration = duration
    }
}

class Running extends Workout {
    type = 'Running'

    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration)
        this.cadence = cadence
        this.calcPace()
        this.setDescription()
    }

    calcPace() {
        let unrounded = (this.duration / this.distance)
        this.pace = unrounded.toFixed(2)
        return this.pace
    }

    setDescription() {
        this.description = `${this.type} on ${this.date.toDateString()}`
    }
}

class Cycling extends Workout {
    type = 'Cycling'

    constructor(coords, distance, duration, elevationGain) {
        super(coords, distance, duration)
        this.elevationGain = elevationGain
        this.calcPace()
        this.setDescription()
    }

    calcPace() {
        let unrounded = (this.duration / this.distance)
        this.pace = unrounded.toFixed(2)
        return this.pace
    }

    setDescription() {
        this.description = `${this.type} on ${this.date.toDateString()}`
    }
}

navigator.geolocation.getCurrentPosition(
    function(position) {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        console.log(`https://www.google.com/maps/@${latitude},${longitude},16.05z`)

        const coords = [latitude, longitude]
        map = L.map('map').setView(coords, 13);

        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker(coords).addTo(map)
            .bindPopup('A pretty CSS popup.<br> Easily customizable.')
            .openPopup();

        map.on('click', function(mapE) {
            form.classList.remove('hidden')
            inputDistance.focus()
            mapEvent = mapE
        })
    },

    function() {
        alert("Could not get position")
    }

)

form.addEventListener('submit', function(e){
    e.preventDefault()

    const type = inputType.value
    const distance = Number(inputDistance.value)
    const duration = Number(inputDuration.value)
    const lat = mapEvent.latlng.lat
    const lng = mapEvent.latlng.lng
    let workout
    let html = ``

    if (type == 'running') {
        const cadence = Number(inputCadence.value)

        workout = new Running([lat, lng], distance, duration, cadence)
        html = `<li class="workout workout--running" data-id=${workout.id}>
        <h2 class="workout__title">${workout.description}</h2>
        <div class="workout__details">
          <span class="workout__icon">🏃‍♂️</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.duration}</span>
          <span class="workout__unit">min</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.pace}</span>
          <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">🦶🏼</span>
          <span class="workout__value">${workout.cadence}</span>
          <span class="workout__unit">spm</span>
        </div>
      </li>`
    }

    if (type == 'cycling') {
        const elevation = Number(inputElevation.value)

        workout = new Cycling([lat, lng], distance, duration, elevation)
        html = `<li class="workout workout--cycling" data-id=${workout.id}>
        <h2 class="workout__title">${workout.description}</h2>
        <div class="workout__details">
          <span class="workout__icon">🚴‍♀️</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.duration}</span>
          <span class="workout__unit">min</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.pace}</span>
          <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⛰</span>
          <span class="workout__value">${workout.elevationGain}</span>
          <span class="workout__unit">m</span>
        </div>
      </li>`
    }

    workouts.push(workout)

    form.insertAdjacentHTML("afterend", html)

    form.reset()

    L.marker([lat, lng]).addTo(map)
        .bindPopup(L.popup({
            maxWidth:250,
            minWidth:100,
            autoClose:false,
            closeOnClick:false,
            className:'running-popup',
        }))
        .setPopupContent('Workout')
        .openPopup();

        console.log(workouts)
    })

inputType.addEventListener('change', function(){
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
})