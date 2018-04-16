import React from 'react';

class GoogleMap extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
      result: {}, 
      query: {}
    }
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
    this.renderMap();
  }

  componentDidUpdate(prevProps, prevState) {
    let sameName = this.props.name === prevProps.name;
    let sameZip = this.props.zip === prevProps.zip;
    
    if (!(sameName && sameZip)) {
      this.renderMap();
    }
  }

  renderMap(map) {
    let service = new google.maps.places.PlacesService(this.map)
      service.textSearch({
        query: this.props.name + ' ' + this.props.zip
      }, (results) => {
        if (results) {
          var request = {placeId: results[0].place_id}
          service.getDetails(request, (result, status) => {
            if (status !== google.maps.places.PlacesServiceStatus.OK) {
              console.error(status);
              return;
            }
            else {
              this.getResults(result)
              console.log('success')
            }
          });
        }
      });
  }

  getResults(result) {
    if (result && (result != this.state.result)) {
      let address = result.formatted_address;
      this.geocoder.geocode({'address': address}, (results, status) => {
        if (status === 'OK') {
          this.map.setCenter(result.geometry.location);
          var marker = new google.maps.Marker({
            map: this.map,
            position: result.geometry.location
          });
        }
      });
      this.setState({result: result}, () => {
        this.props.resultsHandler(this.state.result)
      });
    }
  }

  render() {
    const {name, zip, resultsHandler} = this.props;

    return (
        <div ref="map" className='map' />
    );
  }
}

export default GoogleMap;