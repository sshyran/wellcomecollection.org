// @flow
import { font, classNames } from '../../../utils/classnames';
import { trackEvent } from '../../../utils/ga';
import { Fragment, Component } from 'react';
import Icon from '../Icon/Icon';
import HTMLInput from '../HTMLInput/HTMLInput';
import Space from '../styled/Space';

type Props = {|
  id: string,
  url: string,
|};

// TODO: work out how to handle cutting-the-mustard (?HOC)
// and remove isEnhanced if/when this becomes a more global concern
type State = {|
  isEnhanced: boolean,
  isTextCopied: boolean,
  isClicked: boolean,
|};

function getButtonMarkup(isTextCopied, isClicked) {
  if (!isClicked) {
    return 'Copy URL';
  } else if (isTextCopied) {
    return (
      <Fragment>
        <span className="visually-hidden">link has been</span>Copied
      </Fragment>
    );
  } else {
    return 'Copy failed';
  }
}

class CopyUrl extends Component<Props, State> {
  textInput: ?HTMLInputElement;
  setTextInputRef: Function;
  focusTextInput: Function;

  constructor(props: Props) {
    super(props);
    this.textInput = null;

    // Using refs to get access to elements for e.g. focusing
    // https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
    this.setTextInputRef = el => {
      this.textInput = el;
    };

    this.focusTextInput = () => {
      if (this.textInput) {
        this.textInput.focus();
      }
    };
  }

  state: State = {
    isEnhanced: false,
    isTextCopied: false,
    isClicked: false,
  };

  componentDidMount() {
    this.setState({ isEnhanced: true });
  }

  handleButtonClick = () => {
    const textarea = document.createElement('textarea');
    textarea.setAttribute('style', 'position: fixed; left: -9999px;');
    textarea.innerHTML = this.props.url;
    document.body && document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand('copy');
      this.setState({
        isTextCopied: true,
      });
    } catch (err) {
      this.setState({
        isTextCopied: false,
      });
    }

    this.setState({
      isClicked: true,
    });

    textarea.remove();
    this.focusTextInput();

    trackEvent({
      category: 'CopyUrl',
      action: 'copy url to clipboard',
      label: this.props.id,
    });
  };

  render() {
    const { url } = this.props;
    const { isTextCopied, isClicked } = this.state;

    return (
      <div>
        <HTMLInput
          inputRef={this.setTextInputRef}
          id="share"
          type="text"
          label="share url"
          defaultValue={url}
          isLabelHidden={true}
        />

        {/* TODO: update this button to be `<Button extraClasses: 'btn--tertiary' />
        once we're fully reactified */}

        <Space
          v={{
            size: 'm',
            properties: ['margin-top'],
          }}
          aria-live="polite"
          onClick={this.handleButtonClick}
          data-copy-text={url}
          className={classNames({
            [font('hnm', 5)]: true,
            'btn btn--tertiary flex-inline flex--v-center pointer': true,
            'is-hidden': !this.state.isEnhanced,
          })}
        >
          <span className="flex-inline flex--v-center">
            <Icon
              name="check"
              extraClasses={classNames({
                'icon--inherit icon--match-text': true,
                'is-hidden': !isTextCopied,
              })}
            />
            <span>{getButtonMarkup(isTextCopied, isClicked)}</span>
          </span>
        </Space>
      </div>
    );
  }
}

export default CopyUrl;
