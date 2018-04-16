import React from 'react';

class GoogleMap extends React.Component {
	constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.renderMap()
  }

  componentDidUpdate() {
    this.renderMap()
  }

  renderMap() {
    this.map = new google.maps.Map(this.refs.map, {
      center: {
        lat: 48.858608,
        lng: 2.294471
      },
      zoom: 16
    });

    if (this.props.name) {
      let service = new google.maps.places.PlacesService(this.map)
        service.textSearch({
          query: this.props.name + ' ' + this.props.zip
        }, (results) => {
          console.log(results);
        });
        service.getDetails({
          placeId: 'AIzaSyAzu1D8v-7FaPvVhKYqykGYpMc1WwZ70Mk'
        }, (results) => {
          console.log(results);
        });
      }
  }

  render() {
    const {name, zip} = this.props;

    return (
      <div ref="map" className='map' />
    );
  }
}

export default GoogleMap;