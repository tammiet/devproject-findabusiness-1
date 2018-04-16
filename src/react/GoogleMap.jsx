import React from 'react';

class GoogleMap extends React.Component {
	constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.map = new google.maps.Map(this.refs.map, {
      center: {
        lat: 48.858608,
        lng: 2.294471
      },
      zoom: 16
    });

    this.marker = new google.maps.Marker({
      map: this.map,
      position: {
        lat: 48.858608,
        lng: 2.294471
      }
    });

    this.geocoder = new google.maps.Geocoder();
    this.renderMap()
  }

  componentDidUpdate() {
    this.renderMap()
  }

  renderMap(map) {
    if (this.props.name) {
      let service = new google.maps.places.PlacesService(this.map)
        service.textSearch({
          query: this.props.name + ' ' + this.props.zip
        }, (results) => {
          console.log(results);
          this.getResults(results)
        });
        service.getDetails({
          placeId: 'AIzaSyAzu1D8v-7FaPvVhKYqykGYpMc1WwZ70Mk'
        }, (results) => {
          // console.log(results);
        });
      }
  }

  getResults(results) {
    let address = results[0].formatted_address;
    this.geocoder.geocode({'address': address}, (results, status) => {
      if (status === 'OK') {
        this.map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          map: this.map,
          position: results[0].geometry.location
        });
      }
    })
  }

  render() {
    const {name, zip} = this.props;

    return (
        <div ref="map" className='map' />
    );
  }
}

export default GoogleMap;