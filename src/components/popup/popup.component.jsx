import { TfiText } from 'react-icons/tfi';

import './popup.styles.css';

const Popup = ({ coordinates, display, addBlock, command, popup }) => {
  const blocks = [
    {
      type: 'h1',
      name: 'Heading 1',
      description: 'Big section heading',
      content: '',
    },
  ];
  return (
    <div
      className='popup'
      style={{
        top: coordinates.y + 25,
        left: coordinates.x,
        display: display,
      }}
      ref={popup}
    >
      <div className='popup-header'>
        <b>Add blocks</b>
        <p className='note'>Keep typing to filter, or escape to exit</p>
        <p className='filtering-keywords'>
          Filtering keywords{' '}
          {command.length > 1 && (
            <span className='filter'>{command.slice(1)}</span>
          )}
        </p>
      </div>

      {blocks.length > 0 &&
        blocks
          .filter((b) =>
            b.name.toLowerCase().includes(command.toLowerCase().substring(1))
          )
          .map((block, index) => {
            return (
              <div
                key={index}
                className='popup-block'
                onClick={(e) => {
                  addBlock(block, e);
                }}
              >
                <TfiText className='icon' size={20} />
                <div className='popup-block-content'>
                  <b>{block.name}</b>
                  <p>{block.description}</p>
                </div>
              </div>
            );
          })}
    </div>
  );
};

export default Popup;
