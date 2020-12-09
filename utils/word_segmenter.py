from utils.word_breaker import WordBreaker, SegNode
import kenlm

def segment_word(target, topk, lm):
    """Extracts top-k segmentations of a hashtag using beam search algorithm.

    Parameters
    ----------
    target : str
        Input hashtag to be segmented.
    topk : int
        Value of k in top-k.
    lm : Object
        Language model
     """

    node = SegNode()
    beam_search = WordBreaker(target, topk, lm)
    beam_search.search(node)
    return beam_search.get_topk()