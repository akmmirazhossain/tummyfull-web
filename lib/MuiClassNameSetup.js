// create a new file called `MuiClassNameSetup.js` at the root or src folder.
import { unstable_ClassNameGenerator as ClassNameGenerator } from "@mui/material/className";

ClassNameGenerator.configure((componentName) => `akm-miraz-${componentName}`);
