from config import get_resources
from models import mse_ranker, mr_ranker, mse_multi_ranker, mr_multi_ranker
from utils.feature_extractor import FeatureExtractor
from utils.word_segmenter import segment_word
from utils.rerank import *
import kenlm
import torch

class segmenter:
    def __init__(self, model, modeldir, lm, topk):
        self.model_name = model
        self.topk = topk
        
        # Load language model
        self.language_model = kenlm.LanguageModel(lm)
        
        # Load feature extractor
        self.feature_extractor = FeatureExtractor(get_resources(), model)
        
        # Load torch model
        print('Loading model: ' + model + '.pkl')
        self.model = torch.load(modeldir + model + '.pkl')

    def evaluate(self, target):
        candidates = segment_word(target, self.topk, self.language_model)
        feats = []
        for seg in candidates:
            fv = self.feature_extractor._get_features_for_segmentation(seg, candidates[0])
            feats.append(fv)
        reranked = rerank(candidates, feats, self.model, self.model_name)
        return reranked