import { useEffect, useRef, useState } from 'react';

import { FiClock, FiArrowDownLeft } from 'react-icons/fi';
import { BsCheck2Circle, BsThreeDotsVertical } from 'react-icons/bs';
import { RiCloudyLine } from 'react-icons/ri';
import Popup from '../popup/popup.component';

import './editor.styles.css';
import profile from '../../assets/profile.png';

const Editor = () => {
  const text = useRef(null);
  const popup = useRef(null);
  const [command, setCommand] = useState('');
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [popupDisplay, setPopupDisplay] = useState('none');
  const [startCommand, setStartCommand] = useState(false);
  const [caret, setCaret] = useState(null);

  // This useeffect makes sure that when we first enter the website the caret is on the text block.
  useEffect(() => {
    text.current.focus();
    getCaretCoordinates();
  }, []);

  // This useeffect makes sure that if the popup is at the end of the screen and isn't visible it should be shown above the text instead
  useEffect(() => {
    if (popupDisplay === 'block') {
      if (
        coordinates.y + coordinates.y / 4 + popup.current.offsetHeight >
        window.innerHeight + window.pageYOffset
      ) {
        const newX = coordinates.x;
        const newY = coordinates.y - popup.current.offsetHeight - 30;
        setCoordinates({ x: newX, y: newY });
      }
    }
  }, [coordinates.x, coordinates.y, popupDisplay]);

  // This useeffect makes sure that whenever the command is empty the popup is hidden
  useEffect(() => {
    if (command.length === 0) {
      setPopupDisplay('none');
    }
  }, [command]);

  // This functions is for choosing the command that we want to do based on what's on the popup or what we wrote
  const chooseCommand = (e) => {
    switch (e.key) {
      case 'Enter': {
        // Here we can type for example the command "/1" then type the text we're gonna write in the heading then press Enter to apply that
        const shortcut = command.slice(0, 2);
        if (shortcut === '/1') {
          addBlock(
            {
              type: 'h1',
              name: 'Heading 1',
              description: 'Big section heading /1',
              content: command.slice(2),
            },
            e
          );
        }
        setCommand('');
        break;
      }

      case 'Escape': {
        setPopupDisplay('none');
        setCommand('');
        break;
      }

      case 'Backspace': {
        setCommand(command.substring(0, command.length - 1));
        break;
      }

      case '/': {
        setCommand(command + '/');
        getCaretCoordinates();
        setPopupDisplay('block');
        setStartCommand(true);
        break;
      }

      default: {
        if ((e.which > 47 || e.which === 32) && e.which !== 91 && startCommand)
          setCommand(command + e.key);
      }
    }
  };

  // This function fetches the caret's coordinates as they are necessary for adding the block correctly
  const getCaretCoordinates = () => {
    let x = 0;
    let y = 0;

    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    var div = document.createElement('div');
    range.insertNode(div);

    const rect = range.getClientRects()[0];
    if (rect) {
      x = rect.left;
      y = rect.top;
    }
    div.remove();
    setCaret(selection);
    setCoordinates({ x, y });
  };

  // This functions add the block chosen through the popup
  const addBlock = (block, e) => {
    e.preventDefault();
    setPopupDisplay('none');
    setCommand('');
    setStartCommand(false);
    if (caret) {
      if (caret.focusNode.parentElement.nodeName.toLowerCase() === block.type)
        caret.focusNode.parentElement.insertAdjacentHTML(
          'afterend',
          `<${block.type} data-placeholder='${block.name}'>${block.content}</${block.type}>`
        );
      else
        caret.focusNode.parentElement.insertAdjacentHTML(
          'beforeend',
          `<${block.type} data-placeholder='${block.name}'>${block.content}</${block.type}>`
        );
      clearCommand(caret, command);
      getCaretCoordinates();
    }
  };

  // This function clears the command from the element so that it's not visible anymore
  const clearCommand = () => {
    const element = caret.focusNode.parentElement;
    let caretIndex = 0;
    const selection = window.getSelection();

    if (selection.rangeCount !== 0) {
      const range = window.getSelection().getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretIndex = preCaretRange.toString().length;
    }

    const { innerHTML } = caret.focusNode.parentElement;
    const newInnerHTML =
      innerHTML.substring(0, caretIndex - command.length) +
      innerHTML.substring(caretIndex);
    caret.focusNode.parentElement.innerHTML = newInnerHTML;
    adjustCursor();
  };

  // This function adjusts the cursor to the next element that got created
  const adjustCursor = () => {
    const elementLength = window.getSelection().focusNode.innerHTML.length;
    for (let i = 0; i < elementLength + 1; i++) {
      window.getSelection().modify('move', 'forward', 'character');
    }
  };

  return (
    <div className='editor'>
      <div className='header'>
        <p className='p'>P</p>
        <div style={{ borderLeft: '0.5px solid #cbcdd0', height: '16px' }} />
        <div className='time'>
          <FiClock />
          <p>0min</p>
        </div>
        <div style={{ borderLeft: '0.5px solid #cbcdd0', height: '16px' }} />
        <img src={profile} className='profile' alt='Profile' />
        <div style={{ borderLeft: '0.5px solid #cbcdd0', height: '16px' }} />
        <div className='views'>
          <FiArrowDownLeft />
          <p>0</p>
        </div>
        <BsCheck2Circle color='#9da3ae' />
        <RiCloudyLine color='#43946c' />
        <BsThreeDotsVertical />
      </div>
      <div className='intro'>
        <h1>Front-end developer test project</h1>
        <hr />
        <p>
          Your goal is to make a page that looks exactly like this one, and has
          the ability to create H1 text simply by typing / then 1, then typing
          text, and hitting enter.
        </p>
      </div>
      <div
        data-placeholder='Type / for blocks, @ to link docs people'
        contentEditable='true'
        className='text'
        ref={text}
        onKeyDown={(e) => chooseCommand(e)}
        suppressContentEditableWarning={true}
        onBlur={(e) => {
          e.target.focus();
        }}
      ></div>
      <Popup
        coordinates={coordinates}
        display={popupDisplay}
        addBlock={addBlock}
        command={command}
        popup={popup}
      />
    </div>
  );
};

export default Editor;
