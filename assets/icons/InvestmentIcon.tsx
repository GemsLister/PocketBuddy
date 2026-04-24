import { ms } from "react-native-size-matters";
import Svg, { Path } from "react-native-svg";
export default function InvestmentIcon({ size = 50 }) {
  const scaledSize = ms(size, 0.8);
  return (
    <Svg
      height={scaledSize}
      viewBox="0 -960 960 960"
      width={scaledSize}
      fill="#385a41"
    >
      <Path d="M672.31-200q-13.73 0-23.02-9.29T640-232.31V-360q0-13.73 9.29-23.02t23.02-9.29h55.38q13.73 0 23.02 9.29T760-360v127.69q0 13.73-9.29 23.02T727.69-200h-55.38Zm-220 0q-13.73 0-23.02-9.29T420-232.31v-495.38q0-13.73 9.29-23.02t23.02-9.29h55.38q13.73 0 23.02 9.29t9.29 23.02v495.38q0 13.73-9.29 23.02T507.69-200h-55.38Zm-220 0q-13.73 0-23.02-9.29T200-232.31v-302.7q0-14.3 9.29-23.49 9.29-9.19 23.02-9.19h55.38q13.73 0 23.02 9.29 9.29 9.28 9.29 23.02v302.7q0 14.3-9.29 23.49-9.29 9.19-23.02 9.19h-55.38Z" />
    </Svg>
  );
}
