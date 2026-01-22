# Modifications to x-algorithm Fork

This document tracks modifications made to the [x-algorithm](https://github.com/xai-org/x-algorithm) repository for the Bubble social network demo.

## Overview

The `services/feed-algorithm/` submodule is a fork of the xAI x-algorithm repository, customized for integration with the Bubble Next.js application.

**Original Repository**: https://github.com/xai-org/x-algorithm  
**Fork**: https://github.com/emilioberino/x-algorithm

## Modifications Tracking

### Phase 1: Docker Integration ✅
- [ ] Add Docker support for containerized deployment
- [ ] Create REST API wrapper for service communication
- [ ] Add health check endpoints
- [ ] Environment configuration

### Phase 2: API Integration (TODO)
- [ ] Implement `/health` endpoint
- [ ] Implement `/feed` endpoint for feed generation
- [ ] Implement `/rank` endpoint for content ranking
- [ ] Add request/response validation
- [ ] Add error handling

### Phase 3: Performance Optimization (TODO)
- [ ] Model caching strategy
- [ ] Request batching
- [ ] Response time profiling
- [ ] Load testing

### Phase 4: Customization (TODO)
- [ ] Adapt ranking weights for demo use case
- [ ] Custom filtering rules
- [ ] Demo data integration

## Syncing with Upstream

To pull the latest improvements from the original x-algorithm repository:

```powershell
cd services/feed-algorithm

# Add upstream remote (if not already added)
git remote add upstream https://github.com/xai-org/x-algorithm.git

# Fetch latest changes
git fetch upstream main

# Merge upstream changes (or rebase if you prefer)
git merge upstream/main
```

Then return to the main project and commit:
```powershell
cd ..
git add services/feed-algorithm
git commit -m "Sync with upstream x-algorithm improvements"
```

## Branch Strategy

- **main**: Stable version tracking upstream main
- **develop**: Development branch for custom modifications
- **feature/***: Feature branches for specific changes

## License

This fork maintains the same license as the original x-algorithm repository.
See `services/feed-algorithm/LICENSE` for details.

## Attribution

When using or deploying this project, please maintain proper attribution to:
- **xAI** for the original x-algorithm repository
- Original repository URL in documentation

## Questions?

For questions about modifications:
1. Check the git history: `git log --oneline`
2. Review specific commits: `git show <commit-hash>`
3. Check the original repository for baseline comparison
