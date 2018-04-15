const React = require('React')

class FindMyBusiness extends React.Component {
  constructor() {
    super();
    this.state = {
      name: null,
      zip: 0
    }
  }
  
  render() {
    return (
      <div className='alert alert-success'>
        <p>Hello, World!</p>
      </div>
    )
  }
}

module.exports = FindMyBusiness