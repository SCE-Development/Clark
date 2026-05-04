import Autolinker from 'autolinker';

/**
 * Component that automatically converts URLs and email addresses in text into clickable links.
 * Uses Autolinker.js for robust parsing (handles trailing punctuation, etc.).
 *
 * @param {Object} props
 * @param {string} props.children The text content to linkify.
 */
export default function LinkifiedText({ children }) {
  if (typeof children !== 'string') {
    return <>{children}</>;
  }

  const matches = Autolinker.parse(children, {
    urls: true,
    email: true,
  });

  if (matches.length === 0) {
    return <>{children}</>;
  }

  const elements = [];
  let lastIndex = 0;

  matches.forEach((match, index) => {
    const offset = match.getOffset();
    const matchedText = match.getMatchedText();

    // Add text before the match
    if (offset > lastIndex) {
      elements.push(children.substring(lastIndex, offset));
    }

    const type = match.getType();
    const url = type === 'url' ? match.getUrl() : `mailto:${match.getEmail()}`;

    // Truncate display text if it's too long (> 50 chars)
    const displayText = matchedText.length > 50
      ? `${matchedText.substring(0, 50)}...`
      : matchedText;

    elements.push(
      <a
        key={`link-${index}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-300 underline underline-offset-2 break-all"
        onClick={(e) => e.stopPropagation()}
      >
        {displayText}
      </a>
    );

    lastIndex = offset + matchedText.length;
  });

  // Add remaining text
  if (lastIndex < children.length) {
    elements.push(children.substring(lastIndex));
  }

  return <>{elements}</>;
}

