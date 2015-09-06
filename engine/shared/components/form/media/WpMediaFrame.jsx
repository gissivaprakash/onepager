const React     = require('react');
const PureMixin = require('react/lib/ReactComponentWithPureRenderMixin');
const $         = jQuery;

require("../../../../../assets/css/icon-selector.bootstrap.min.css");

let WpMediaFrame = React.createClass({
  mixins: [PureMixin],
  getInitialState() {
    return {
      focus: false
    };
  },
  onFocus(){
    this.setState({focus: true});
  },

  onBlur(){
    this.setState({focus: false});
  },

  getValue(){
    return React.findDOMNode(this.refs.input).value;
  },

  wpMedia(btn, cb){
    // Prepare the variable that holds our custom media manager.
    let opMediaFrame;

    // Bind to our click event in order to open up the new media experience.
    $(btn).click(function (e) {
      // Prevent the default action from occurring.
      e.preventDefault();

      // If the frame already exists, re-open it.
      if (opMediaFrame) {
        opMediaFrame.open();
        return;
      }

      opMediaFrame = wp.media.frames.opMediaFrame = wp.media({});

      opMediaFrame.on('select', function () {
        // Grab our attachment selection and construct a JSON representation of the model.
        let mediaAttachment = opMediaFrame.state().get('selection').first().toJSON();

        // Send the attachment URL to our custom input field via $.
        cb(mediaAttachment.url);
      });

      // Now that everything has been set, let's open up the frame.
      opMediaFrame.open();
    });
  },

  componentDidMount() {
    let buttonEl = React.findDOMNode(this.refs.select);
    let inputEl  = React.findDOMNode(this.refs.input);

    this.wpMedia(buttonEl, imageSrc=> {
      $(inputEl).val(imageSrc);
      this.props.onChange();
    });

  },

  componentWillUnmount(){
    $(React.findDOMNode(this.refs.select)).unbind();
  },

  handleReset(){
    React.findDOMNode(this.refs.input).value = "";
    this.props.onChange();
  },

  _renderInputGroup(){
    let classes = this.props.className + " form-control image-input";

    return (
      <div className="input-group">
        <input onMouseEnter={this.onFocus} {...this.props} type="text" className={classes} ref="input"/>
          <span className="input-group-btn">
            <button className="btn btn-primary" ref="select" type="button">
              <span className="fa fa-picture-o"></span> image
            </button>
            <button onClick={this.handleReset} className="btn btn-primary" ref="refresh" type="button">
              <span className="fa fa-undo"></span>
            </button>
          </span>
      </div>
    );
  },

  _renderInput(){
    let classes = this.props.className + " form-control image-input";

    return (
      <input onMouseLeave={this.onBlur} {...this.props} type="text" className={classes} ref="input"/>
    );
  },

  render() {
    let {focus} = this.state;

    return (
      <div className="form-group">
        {this.props.label ? <label>{this.props.label}</label> : null }

        { focus ? this._renderInput() : this._renderInputGroup() }

        <div className="media-preview"></div>
      </div>
    );
  }
});

module.exports = WpMediaFrame;
