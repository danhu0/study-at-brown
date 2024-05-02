import { PlaceboxProps } from "./Placebox";

/**
 * Simple function to transform raw attribute data into a single readable string of
 * the various attributes. Uses a helper function to determine thresholds.
 */
export function getAttributes(props: PlaceboxProps): Array<String> {
  let attributes: Array<String> = [];

  // Food availability
  // if (props.food_available.length > 0) {
  //   props.food_available.forEach((currentValue) => {
  //     attributes.push(currentValue + " available");
  //   });
  // }

  // Natural Light
  attributes.push(
    strengthThreshold(props.natural_light_level) + " natural light"
  );

  // Noise Level
  attributes.push(strengthThreshold(props.noise_level) + " noise");

  // View
  if (props.view) attributes.push("good view");

  // Privacy
  if (props.private) attributes.push("private");

  // Comfort
  attributes.push(strengthThreshold(props.comfort) + " comfort");

  // Campus positioning
  attributes.push("location: " + props.campusposition);

  return attributes;
}

/**
 *
 * @param quantity - the quanitity of the attribute we're measuring
 * @returns - qualitative interpretation of the quanity
 */
function strengthThreshold(quantity: number): string {
  if (quantity <= 3) {
    return "little ";
  } else if (quantity <= 6) {
    return "moderate ";
  } else {
    return "lots of ";
  }
}
