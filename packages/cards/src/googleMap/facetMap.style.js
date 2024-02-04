import { withStyles } from '@material-ui/styles';

export default withStyles((theme) => {
  return {
    outer: {
      width: '100%',
      // border: '1px solid black',
      '& :focus': {
        outline: '0 !important'
      },
    },

    closeButton: {
      background: 'none rgb(255, 255, 255)',
      border: '0px',
      margin: '10px',
      padding: '0px',
      textTransform: 'none',
      appearance: 'none',
      position: 'absolute',
      cursor: 'pointer',
      userSelect: 'none',
      borderRadius: '2px',
      height: '40px',
      width: '40px',
      boxShadow: 'rgba(0, 0, 0, 0.3) 0px 1px 4px -1px',
      overflow: 'hidden',
      top: '0px',
      right: '0px',
    },

    closeIcon: {
      height: '18px', 
      width: '18px',
    },

    iconHover: {
      display: 'none',
    }

    // placeHolder: {
    //   padding: '1rem',
    //   width: '100%',
    //   borderWidth: '1px',
    // },
  }
});
