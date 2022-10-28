import { AiOutlineDoubleRight, AiOutlineDown } from 'react-icons/ai';
import { BsBook } from 'react-icons/bs';
import { FiUnlock } from 'react-icons/fi';

import './top-bar.styles.css';

const TopBar = () => {
  return (
    <div className='top-bar'>
      <AiOutlineDoubleRight color='#6c727f' />
      <div className='top-bar-path'>
        <BsBook />
        <p>
          <u>Main</u>
        </p>
        <span>/</span>
        <p>Getting started</p>
        <span>/</span>
        <p>Front-end developer test proje...</p>
      </div>
      <div className='top-bar-mode'>
        <FiUnlock />
        <p>Editing</p>
      </div>
      <div style={{ borderLeft: '1px solid #9ca2ad', height: '16px' }} />
      <div className='top-bar-space'>
        <p>Publish Space</p>
        <AiOutlineDown />
      </div>
    </div>
  );
};

export default TopBar;
