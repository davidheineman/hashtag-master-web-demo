from config import get_resources
from models import mse_ranker, mr_ranker, mse_multi_ranker, mr_multi_ranker
from utils.feature_extractor import FeatureExtractor
from utils.word_segmenter import segment_word
from utils.rerank import *
import kenlm
import torch

class Segmenter:
    def __init__(self, config):
        """Loads the language model, feature extractor and trained Torch model onto the server

        Parameters
        ----------
        config : Dictionary
            Path to language and torch models and desired topk segmentation.

        """

        self.model_name = config["model"]
        self.topk = config["topk"]
        
        # Load language model
        self.language_model = kenlm.LanguageModel(config["language_model"][0])
        
        # Load feature extractor
        self.feature_extractor = FeatureExtractor(get_resources(), config["model"])
        
        # Load torch model
        print('Loading model: ' + config["model"] + '.pkl')
        self.model = torch.load(config["model_folder"] + config["model"] + '.pkl')

    def evaluate(self, target):
        """Evaluates an individual input hashtag based on the trained Torch model.

        Parameters
        ----------
        targer : str
            The hashtag to be segemnted

        Returns
        ------
        List
            List of all k-segmentations after being reranked by the Torch model
        """

        candidates = segment_word(target, self.topk, self.language_model)
        feats = []
        for seg in candidates:
            fv = self.feature_extractor._get_features_for_segmentation(seg, candidates[0])
            feats.append(fv)
        reranked = rerank(candidates, feats, self.model, self.model_name)
        return reranked