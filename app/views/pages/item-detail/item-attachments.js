import React from 'react/addons';
import _ from 'lodash';
import helpers from '../../components/helpers';
import ItemDetailMixin from './detail-mixin';
import {State} from 'react-router'
import Slick from 'react-slick';
import classNames from "classnames";

const CarouselSettings = {
  dots: false,
  infinite: true,
  slidesToShow: 3,
  speed: 500,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
};

var ItemAttachments = React.createClass({

  mixins: [State, ItemDetailMixin],

  getInitialState() {
    return {
      panelOpen: false
    }
  },

  propTypes() {
    attachments: React.PropTypes.shape({
      _href: React.PropTypes.string,
      created_at: React.PropTypes.string,
      created_by: React.PropsTypes.shape({
        account: React.PropTypes.object,
        created_at: React.PropTypes.string,
        email: React.PropTypes.string,
        first_name: React.PropTypes.string,
        id: React.PropTypes.number,
        last_login: React.PropTypes.string,
        last_name: React.PropTypes.string
      }),
      href: React.PropTypes.string,
      id: React.PropTypes.number,
      item: React.PropTypes.object,
      name: React.PropTypes.string
    })
  },

  togglePanel() {
    this.setState({panelOpen: !this.state.panelOpen});
  },

  counts(imageCount, fileCount) {
    let counts = [];

    if (!imageCount && !fileCount) {
      counts.push(<li key="no-attachment">No Attachments</li>)
    }

    if (imageCount) {
      counts.push(<li key="count__images">Images: {imageCount}</li>)
    }
    if (fileCount) {
      counts.push(<li key="count__files">Files: {fileCount}</li>);
    }

    return counts;
  },

  attachmentsHeader(imagesCount, filesCount) {
    let counts = this.counts(imagesCount, filesCount);
    let headerClasses = classNames({
      'header-dark': true,
      'open': this.state.panelOpen
    });
    let toggleClasses = classNames({
      'toggle': true,
      'transparent': !this.props.attachments.length
    })
    let caretClasses = `glyphicon glyphicon-menu-${this.caretState()}`;

    return (
      <div className={headerClasses}>
        <a className={toggleClasses} onClick={this.togglePanel}>
          <span aria-hidden="true" className={caretClasses}/>
        </a>
        <div className="sep-vertical"></div>
        <div className="title">Attachments</div>
        <ul className="attachments__info-list">{counts}</ul>
      </div>
    )
  },

  attachmentsViewer(images) {
    if (images && images.length) {
      return _.map(images, (image, i) => {
        return (
          <li key={i}>
            {this.openNewTabLink(image.href, image.name)}
          </li>
        )
      })
    }
    /*
      TODO: Use when have embedly
      if (this.props.attachments) {
        var attachments = _.map(this.props.attachments, (attachment, i) => {
                            // Temp Greyscale before authed asset use
                            var styles = {
                              width: '33%',
                              height: '170px',
                            }
                            //background: `url(${attachment.href}) no-repeat`
                            // 'background-color': `RGBA(69,69,69, ${parseFloat((Math.random() * (0.120 - 0.0200) + 0.0200))})`,
                            // Updaate with embedly
                            return (
                              <img src={attachment.href} className="attachment-slide" key={i} style={styles} onClick={_.partial(this.showAttachment, attachment.href)}>
                                {this.openNewTabLink(attachment.href)}
                              </img>
                            );
                          });
        return (
          <Slick {...CarouselSettings}>
            {attachments}
          </Slick>
        );
      }
    */

  },

  openNewTabLink(url, text) {
    return <a className="attachment-link" href={url} target="_blank">{text}</a>
  },

  showAttachment(href, ev) {
    window.open(href);
    console.log('Implement attachment viewer: ');
  },

  caretState() {
    return this.state.panelOpen ? 'down' : 'right'
  },

  fileList(files) {
    if (files && files.length) {
      return _.map(files, (file, i) => {
        return (
          <li key={i}>
            {this.openNewTabLink(file.href, file.name)}
          </li>
        )
      })
    }
  },

  images() {
    return _.chain(this.props.attachments)
                    .map((attachment) => {
                      if (this.imageFileExt(attachment._href)) {
                        return attachment;
                      }
                    })
                    .compact()
                    .value();
  },

  attachmentsContent() {
    if (this.props.attachments.length) {
      let images = this.images();
      let attachmentViewer = this.attachmentsViewer(images);
      let files = _.difference(this.props.attachments, images);
      let fileList = this.fileList(files);

      return ([
        <div key="attachments" className="col-lg-12">
          <ul className="links">
            {attachmentViewer}
          </ul>
        </div>,
        <div key="images" className="col-lg-12">
          <ul className="links">
            {fileList}
          </ul>
        </div>
      ])
    } else {
      return (
        <div className="col-lg-12 action__restricted">
          No attachments
        </div>
      )
    }
  },

  imageFileExt(url) {
    return (/\.(gif|jpg|jpeg|tiff|png)/i).test(url);
  },

  render: function() {
    let content = this.attachmentsContent();
    let containerClasses = classNames({
      "section attachments no-gutter": true,
      "col-lg-3 visible-lg-block": this.props.size === 'large',
      "col-md-6 visible-md-block": this.props.size === 'medium'
    })

    return (
      <div className={containerClasses}>
        <div className="col-lg-12">
          {this.header('attachments')}
        </div>
        {content}
      </div>
    )
  }

});

export default ItemAttachments;

/* - Use when embedly works
let header = this.attachmentsHeader(images.length, files.length);
let contentClasses = classNames({
  'content-dark': true,
  'open': this.state.panelOpen
});
<div className="col-lg-12">
  {header}
  <div className={contentClasses}>
    <div className="attachments-viewer">
    </div>
    <div className="attachments__links">
    </div>
    <div className="col-lg-12 attachments__internals">
      <div className="col-lg-6">
        <div className="title">
          Images: {images.length}
        </div>
        <div className="sep"></div>
        <ul className="links">
          {attachmentViewer}
        </ul>
      </div>
      <div className="col-lg-6">
        <div className="title">
          Files: {files.length}
        </div>
        <div className="sep"></div>
        <ul className="links">
          {fileList}
        </ul>
      </div>
    </div>
  </div>
</div>
*/
