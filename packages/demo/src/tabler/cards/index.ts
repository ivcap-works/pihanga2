import { PiRegister } from "@pihanga/core"

// Import all local components
import { init as tbPageInit } from "./tbPage"
import { init as tbCardInit } from "./tbCard"
import { init as tbDataTable } from "./tbDataTable"
import { init as tbActionBar } from "./tbActionBar"
import { init as tbButton } from "./tbButton"
import { init as tbXLCard } from "./tbXLCard"
// import { init as tbSearch } from './tbSearch';
import { init as tbSpinner } from './tbSpinner';
// import { init as tbImageWithDetails } from './tbImageWithDetails';
import { init as tbDataGrid } from "./tbDataGrid"
// import { init as tbRespCols } from './tbResponsiveColumns';
// import { init as loginPageInit } from './tbLoginPage';
// import { init as cardInit } from './tbModalCard';
// import { init as emptyListInit } from "./tbEmptyList";
// import { init as stepInit } from "./tbSteps";

export * from "./constants"

//export type { ButtonType } from './tbButton';
// export * from './tbButton';
// export * from './tbSearch';
// export * from './tbResponsiveColumns';

export function init(register: PiRegister): void {
  tbPageInit(register)
  tbCardInit(register)
  tbDataTable(register)
  tbActionBar(register)
  tbButton(register)
  tbXLCard(register)
  tbSpinner(register);
  // tbImageWithDetails(register);
  tbDataGrid(register)
  // tbRespCols(register);
  // loginPageInit(register);
  // emptyListInit(register);
  // tbSearch(register);
  // cardInit(register);
  // stepInit(register);
}
