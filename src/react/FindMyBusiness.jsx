import React from 'react';

class FindMyBusiness extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      zip: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleName = this.handleName.bind(this);
    this.handleZip = this.handleZip.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  handleName(event) {
    this.setState({name: event.target.value});
  }

  handleZip(event) {
    this.setState({zip: event.target.value});
  }
  
  render() {
    return (
      <div className='entry'>
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:
            <input type="text" name="name" value={this.state.name} className="name" onChange={this.handleName} />
          </label>
          <label>
            Zipcode
            <input type="text" name="zip" value={this.state.zip} className="zip" onChange={this.handleZip} />
          </label>
            <input type="submit" value="Submit" />
        </form>
      </div>
    )
  }
}

module.exports = FindMyBusiness