# In-Place Test-Time Training (In-Place TTT)

**Paper:** [arXiv:2604.06169](https://arxiv.org/abs/2604.06169)  
**Venue:** ICLR 2026 Oral  
**Code:** [GitHub](https://github.com/ByteDance-Seed/In-Place-TTT)

## Why It Matters

- Current LLMs are "static" — trained once, deployed forever
- Test-Time Training (TTT) lets models adapt at inference time, but had issues:
  - Architectural incompatibility
  - Computational inefficiency
  - Misaligned objectives for language modeling
- In-Place TTT fixes all three:
  - Uses the final MLP projection matrix as "fast weights" (drop-in)
  - Replaces generic reconstruction with Next-Token-Prediction objective
  - Chunk-wise updates scale with context parallelism

## Key Results

- 4B parameter model achieves superior performance on 128k context tasks
- When pre-trained from scratch, outperforms other TTT approaches

## Implementation Notes

- Cloned repo to experiments/in_place_ttt
- PyTorch implementation with VeOmni framework
- Supports Qwen3-8B and LLaMA3.1-8B