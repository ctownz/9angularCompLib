export class Style {
    id: string;
    name: string;
    primary: string = '#1976d2';
    color: string = '#fff';
    btnColor: string = '#fff';
    gray:  string = '#C6C9E8';
    error: string = '#ff0000';
    font: string = 'inherit';
    fontColor?: 'inherit';
    fontFamily: string = 'inherit';
    fontSize: string = 'inherit';  // NA on buttons, inputs due to size
    fontWeight: string  = 'inherit';
    border: string = '1.5px solid #C6C9E8'; 
    borderRadius: string = '3px';
    borderColor: string;
    backgroundColor: string = 'transparent';
    outline?: string = '1.5px solid #C6C9E8';
    public ltPrimary?: string = '#8c9eff';
    public dkPrimary?: string = '#0d47a1';
    public secondary?: string = '#ff0000';
    public ltSecondary?: string = '#d50000';
    dkSecondary?: string = '#d50000';
    text?: string = 'inherit';
    accent?: string = '#ff0000';

    size?: string = 'medium';
    type?: string; 

    // icons
    iconLeft?: string;
    iconRight?: string;
    iconColor: string = '#C6C9E8';
    toggle?: string;
    width?: string;
  }
  