# Contributing to Sanskrit Agent Communication System

Thank you for your interest in contributing! This project aims to preserve and promote Sanskrit philosophical traditions through modern technology.

## Code of Conduct

Be respectful, inclusive, and considerate. We welcome contributors from all backgrounds.

## How to Contribute

### Reporting Issues

- Check existing issues first
- Provide clear description and steps to reproduce
- Include system info (Node version, OS)
- For Sanskrit-related issues, include Devanāgarī text examples

### Submitting Pull Requests

1. **Fork** the repository
2. **Create a branch**: `git checkout -b feature/your-feature-name`
3. **Make changes**: Follow coding standards below
4. **Test**: Ensure all tests pass (`npm test && npm run build`)
5. **Commit**: Use clear, descriptive messages
6. **Push**: `git push origin feature/your-feature-name`
7. **Open PR**: Describe changes and link relevant issues

## Development Setup

```bash
git clone https://github.com/akulasairohit/Sanskrit
cd Sanskrit/mcp-server
npm install
npm run build
npm run demo:vedanta  # Test basic functionality
```

## Coding Standards

### TypeScript
- Use TypeScript strict mode
- Add JSDoc comments for public APIs
- Follow existing code style
- Run `npm run lint` before committing

### Sanskrit Content
- Use proper Devanāgarī Unicode (U+0900–U+097F)
- Include IAST transliteration for academic reference
- Cite sources with critical editions
- Verify authenticity with traditional commentaries

### Commit Messages
```
feat: Add new grammar pattern detection
fix: Correct sandhi detection for vowel combinations
docs: Update README with installation instructions
refactor: Reorganize vedic-corpus-parser structure
test: Add validation tests for Dvaita agent responses
```

## Adding Vedic Texts

When contributing to the corpus:

1. **Verify authenticity**: Use critical editions (Gītā Press, Ānandāśrama, etc.)
2. **Include metadata**: Text, chapter, verse, edition, reliability score
3. **Add commentaries**: Traditional ācārya interpretations
4. **Cite properly**: Include author, tradition, date, reliability
5. **Test queries**: Ensure new texts are searchable

Example:
```typescript
this.addPassage({
  sanskrit: "तत्त्वमसि श्वेतकेतो",
  transliteration: "tat tvam asi śvetaketo",
  translation: "Thou art That, O Śvetaketu",
  reference: {
    text: "Chāndogya Upaniṣad",
    chapter: 6,
    verse: 8,
    section: "16",
    edition: "Ānandāśrama Sanskrit Series"
  },
  reliability: 0.99,
  keywords: ["mahavakya", "advaita", "identity"]
});
```

## Testing

- Run `npm test` for validation tests
- Test examples: `npm run demo:vedanta`, `npm run demo:live`
- Verify grammar detection with new Sanskrit text
- Check cultural element tracking

## Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for API changes
- Update examples for new features
- Keep PUBLICATION_README.md synced for academic context

## Areas for Contribution

### High Priority
- [ ] Expand Vedic corpus (more Upaniṣads, Brahma Sūtras)
- [ ] Add other Vedanta schools (Viśiṣṭādvaita, Śuddhādvaita)
- [ ] Improve grammar detection accuracy
- [ ] Add prosody/meter detection for verses

### Medium Priority
- [ ] Web UI for agent conversations
- [ ] Export conversations to academic formats
- [ ] Multi-language support (add Hindi translations)
- [ ] Performance optimization for large corpus

### Research
- [ ] Expert evaluation studies
- [ ] Pedagogical effectiveness testing
- [ ] Cross-cultural adaptations
- [ ] Integration with other Sanskrit tools

## Questions?

- Open a GitHub issue for bugs or feature requests
- For academic collaborations, see PUBLICATION_README.md
- For general questions, use GitHub Discussions

## Cultural Sensitivity

This project works with sacred texts from living traditions:

- **Respect**: Treat texts and traditions with reverence
- **Accuracy**: Prioritize authenticity over convenience
- **Attribution**: Always credit traditional sources
- **Purpose**: Educational and preservation goals only

Thank you for helping preserve Sanskrit philosophical heritage! 🙏

---

*Last updated: October 2025*
