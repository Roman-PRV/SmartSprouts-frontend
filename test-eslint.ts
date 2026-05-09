import { expect, vi } from 'vitest';
const mockCheckAnswers = vi.fn();
expect(mockCheckAnswers).toHaveBeenCalledWith(
    expect.objectContaining({
        payload: expect.objectContaining({
            answers: expect.arrayContaining([]) as unknown
        }) as unknown
    })
);
