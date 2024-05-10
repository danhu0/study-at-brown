import { PlaceboxProps } from "./Placebox";

/**
 * Simple function to transform raw attribute data into a single readable string of
 * the various attributes. Uses a helper function to determine thresholds.
 */
export function getAttributes(props: PlaceboxProps): Array<String> {
  let attributes: Array<String> = [];

  // Natural Light
  attributes.push(
    strengthThreshold(props.natural_light_level) + " natural light"
  );

  // Noise Level
  attributes.push(strengthThreshold(props.noise_level) + " noise");

  // View
  if (props.view) attributes.push("good view");

  // Privacy
  // if (props.private) attributes.push("private");
  attributes.push(strengthThreshold(props.private) + " privacy");

  // Comfort
  attributes.push(strengthThreshold(props.comfort) + " comfort");

  // Campus positioning
  attributes.push(props.campus_position + " campus");

  return attributes;
}

/**
 * Interprets the raw numeric value associated with an attribute and gives it
 * a qualitative value for the attribute overview.
 *
 * @param quantity - the quanitity of the attribute we're measuring
 * @returns - qualitative interpretation of the quanity
 */
function strengthThreshold(quantity: number): string {
  if (quantity <= 1) {
    return "little ";
  } else if (quantity <= 2) {
    return "moderate ";
  } else {
    return "high ";
  }
}
