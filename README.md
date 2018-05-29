# readyblocks-blocks

Blocks and common block templates for ReadyBlocks.

### Templates

Branches prefixed with `template/` refer to a block template of some form and are used
as a base for other blocks. The base template at `template/base` contains common code
used to build other blocks and is the source branch for all other templates and blocks.
While template branches contain complete CI configurations and tests, they are only
tested in CI and not deployed as Docker images.

### Blocks

Branches prefixed with `block/` refer to a specific block and are not used as a base for
any other blocks. Each block contains its own tests, CI configuration, and documentation,
and each block is tested and deployed individually.

### Development

Blocks and inheriting templates receive updates when necessary by parent merge, but may
remain on an older version until incompatibilities or missing upstream features are
implemented.

### Template and Block heirarchy

* `template/base` Base of all blocks
