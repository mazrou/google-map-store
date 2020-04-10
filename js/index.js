

window.onload = () => {


}

let infoWindow
let markers = []
let map
function initMap() {
    var losAnglos = {
        lat: 34.063380,
        lng: -118.358080
    };
    map = new google.maps.Map(document.getElementById('map'), {
        center: losAnglos,
        zoom: 11,
        mapTypeId: 'roadmap',
    });
    infoWindow = new google.maps.InfoWindow();

    seartchStores()


}

function clearLocations() {
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers.length = 0;
}

function setOnClickListner() {
    let storesElemets = document.querySelectorAll('.store-container')
    storesElemets.forEach(function (elem, index) {

        elem.addEventListener('click', _ => {
            new google.maps.event.trigger(markers[index], 'click');
        })
    })
}


function displayStores(foundStore) {
    let storeHtml = ''
    for (let [index, store] of foundStore.entries()) {
        let address = store['addressLines']
        let phone = store['phoneNumber']


        storeHtml += ` 
             <div class="store-container">
               <div class = "store-container-background">
                    <div class="store-info-container">
                        <div class="store-address">
                            <span> ${address[0]} </span>
                            <span> ${address[1]} </span>
                        </div>
                        <div class="store-phone-number">
                            ${phone} 
                        </div>
                    </div>
                    <div class="store-number-container">
                        <div class="store-number">${index + 1}</div>
                    </div>
                </div>
            </div>
            `
    }
    document.querySelector('.stores-list').innerHTML = storeHtml

}

function showStoresMarkers(foundStore) {
    var bounds = new google.maps.LatLngBounds()
    for (let [index, store] of foundStore.entries()) {

        let latlng = new google.maps.LatLng(
            store['coordinates']['latitude'],
            store['coordinates']['longitude']
        )
        let name = store['name']
        let address = store['addressLines'][0]
        let openStatusText = store['openStatusText']
        let phoneNumber = store['phoneNumber']
        bounds.extend(latlng);
        createMarker(latlng, name, address, phoneNumber, openStatusText, index + 1)
    }
    map.fitBounds(bounds);
}



function seartchStores() {
    let foundStore = []
    let zipCode = document.getElementById('zip-code-input').value
    if (zipCode) {
        stores.forEach((store) => {
            let postal = store['address']['postalCode'].substring(0, 5)
            if (zipCode === postal) {
                foundStore.push(store)
            }
        })
    }
    else {
        foundStore = stores
    }
    clearLocations()

    displayStores(foundStore)
    showStoresMarkers(foundStore)
    setOnClickListner()
}



function createMarker(latLang, name, address, phoneNumber, openStatusText, index) {

    let html = `
            <div class="store-info-window">
                <div class = "store-info-name">
                    ${name}
                </div>
                <div class ="store-info-status">
                    ${openStatusText}
                </div>
                 <div class ="store-info-address">
                    <div class = "circle">
                        <i class="fas fa-location-arrow"></i>
                    </div>
                    ${address}
                </div>
                <div class ="store-info-phone-number">
                    <div class = "circle">
                        <i class="fas fa-phone"></i>
                    </div>
                    ${phoneNumber}
                </div>
            </div>
    `
    var marker = new google.maps.Marker({
        position: latLang,
        map: map,
        label: index.toString()

    });

    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    });
    markers.push(marker)

}