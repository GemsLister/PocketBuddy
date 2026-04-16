import { ms } from "react-native-size-matters";
import Svg, { Path } from "react-native-svg";
export default function ExpenseIcon({ size = 50 }) {
  const scaledSize = ms(size, 0.8);
  return (
    <Svg height={scaledSize} width={scaledSize} viewBox="0 -960 960 960">
      <Path
        d="M120-80v-800l60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60v800l-60-60-60 60-60-60-60 60-60-60-60 60-60-60-60 60-60-60-60 60-60-60-60 60Zm120-200h480v-80H240v80Zm0-160h480v-80H240v80Zm0-160h480v-80H240v80Zm-40 404h560v-568H200v568Zm0-568v568-568Z"
        fill="#385a41"
      />
    </Svg>
  );
}
