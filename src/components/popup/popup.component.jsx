import { TfiText } from 'react-icons/tfi';

import './popup.styles.css';

// This is the popup, I wanted to make it as a separate component so that the code is cleaner.
const Popup = ({ coordinates, display, addBlock, command, popup }) => {
  // This is an array for the blocks that we want to add, for now there is only h1 as per the requirements but
  // if we want to add more we can just edit the array, this allows scalability
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
        top: coordinates.y + 35,
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
